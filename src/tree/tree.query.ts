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
          depth,
          parent,
          secret,
          seq
        )
        VALUES
        (?, ?, ?, ?, ?, ?,
          (
            SELECT IFNULL(MAX(tr.seq), 0) + 1
            FROM tree tr
            WHERE tr.depth = ?
            AND tr.type = ?
            AND tr.parent = ?
          )
        )                  
      `);
      queryParams.push(request.type);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.depth);
      queryParams.push(request.parent);
      queryParams.push(request.secret);

      queryParams.push(request.depth);
      queryParams.push(request.type);
      queryParams.push(request.parent);
      break;

    case TreeQueryId.selectTree:
      break;

    case TreeQueryId.updateTree:
      query.push(`
        UPDATE md2.tree
        SET
          name = ?,
          content = ?,
          secret = ?
        WHERE id = ?        
      `);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.secret);
      queryParams.push(request.id);
      break;

    case TreeQueryId.deleteTree:
      query.push(`
        UPDATE md2.tree
        SET 
          delete_yn = 'Y'
          ,seq = 99999
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
          tr.depth,
          tr.parent,
          tr.secret,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.parent = ?
        AND tr.delete_yn = 'N'
      `);
      queryParams.push(request.parent);

      if (request.secret === 0) {
        query.push(`AND tr.secret = 0`);
      }
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
          tr.depth,
          tr.parent,
          tr.secret
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
            FROM tree t
            WHERE t.depth = ?
            AND t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t1
          JOIN (
            SELECT 
              RANK() OVER(ORDER BY t.seq) AS 'num'
              ,t.id
            FROM tree t
            WHERE t.depth = ?
            AND t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t2
          ON t1.num = t2.num ${request.upDown === UpDown.UP? `+` : `-`} 1
          WHERE t1.id = ?	
        ) AS sq
        SET tr.seq = sq.givSeq
        WHERE tr.id = sq.surroundId
      `);
      queryParams.push(request.depth);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      queryParams.push(request.depth);
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
          tr.depth,
          tr.parent,
          tr.secret,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.id = ?
      `);
      queryParams.push(request.id);
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