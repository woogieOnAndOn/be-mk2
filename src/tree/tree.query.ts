import { QueryInfo } from '../common/common.model';
import { UpDown } from './tree.model';

export enum TreeQueryId {
  insertTree,
  selectTree,
  updateTree,
  deleteTree,
  retrieveTree,
  retrieveDeleteTarget,
  updateSeqSurroundingTree,
  updateSeqTargetTree,
  getTree,
  correctSeqTargetTree,
  updateLocationTree,
}

export const TreeQuery = (queryId: TreeQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case TreeQueryId.insertTree:
      query.push(`
        INSERT INTO md2.tree
        (
          type,
          name,
          content,
          parent,
          seq,
          user
        )
        VALUES
        (?, ?, ?, ?,
          (
            SELECT IFNULL(MAX(tr.seq), 0) + 1
            FROM md2.tree tr
            WHERE tr.type = ?
            AND tr.parent = ?
            AND tr.user = ?
            AND tr.delete_yn = 'N'
          ),
          ?
        )                  
      `);
      queryParams.push(request.type);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.parent);

      queryParams.push(request.type);
      queryParams.push(request.parent);
      queryParams.push(request.user);

      queryParams.push(request.user);
      break;

    case TreeQueryId.updateTree:
      query.push(`
        UPDATE md2.tree
        SET
          name = ?,
          content = ?
        WHERE id = ?        
      `);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.id);
      break;

    case TreeQueryId.deleteTree:
      query.push(`
        UPDATE md2.tree
        SET 
          delete_yn = 'Y'
        WHERE id IN (${request})
      `);
      break;

    case TreeQueryId.retrieveTree:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.parent = ?
        AND tr.user = ?
        AND tr.delete_yn = 'N'
      `);
      queryParams.push(request.parent);
      queryParams.push(request.user);

      query.push(`
        ORDER BY tr.type, tr.seq
      `);
      break;

    case TreeQueryId.retrieveDeleteTarget:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent
        FROM md2.tree tr
        WHERE tr.parent = ?
        AND tr.delete_yn = 'N'
      `);
      queryParams.push(request);
      break;
    
    case TreeQueryId.updateSeqSurroundingTree:
      query.push(`
        UPDATE md2.tree AS tr,
        (
          SELECT
            t1.seq AS givSeq
            ,t2.id AS surroundId
          FROM 
          (
            SELECT 
              RANK() OVER(ORDER BY t.seq) AS 'num'
              ,t.id
              ,t.seq
            FROM md2.tree t
            WHERE t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t1
          JOIN (
            SELECT 
              RANK() OVER(ORDER BY t.seq) AS 'num'
              ,t.id
            FROM md2.tree t
            WHERE t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t2
          ON t1.num = t2.num ${request.upDown === UpDown.UP? `+` : `-`} 1
          WHERE t1.id = ?	
        ) AS sq
        SET tr.seq = sq.givSeq
        WHERE tr.id = sq.surroundId
      `);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      queryParams.push(request.id);

      break;
    
    case TreeQueryId.updateSeqTargetTree:
      query.push(`
        UPDATE md2.tree 
        SET seq = seq ${request.upDown === UpDown.UP? `-` : `+`} 1
        WHERE id = ?
      `);
      queryParams.push(request.id);
      break;
    
    case TreeQueryId.getTree:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.id = ?
      `);
      queryParams.push(request.id);
      break;
    
    case TreeQueryId.correctSeqTargetTree:
      query.push(`
        UPDATE md2.tree t2, (SELECT @seqNum:= 0 ) r
        SET t2.seq = (@seqNum := @seqNum + 1)
        WHERE t2.id IN (
          SELECT t1.id 
          FROM (
            SELECT * 
            FROM md2.tree t 
            WHERE t.parent = ?
            AND t.type = ?
            ORDER BY seq
          ) AS t1
        )      
      `);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      break;
    
    case TreeQueryId.updateLocationTree:
      query.push(`
        UPDATE md2.tree t 
        SET 
          t.parent = ?
          ,t.seq = 99999999
        WHERE t.id IN (
      `);
      queryParams.push(request.parent);

      request.ids && request.ids.forEach((id: number, index: number, ids: number[]) => {
        query.push(`?`);
        queryParams.push(id);
        if (ids.length !== index + 1) query.push(`,`);
      });
      query.push(`)`);
      break;

    default:
      break;
  }

  if(query.length > 0) {
      result.query = query.join(' ');
      result.queryParams = queryParams;
  }

  return result;
}