import { inject, injectable } from 'inversify';
import { UserSession } from '../userSession/userSession.model';
import { UserSessionService } from '../userSession/userSession.service';
import { Message, MethodType, ControllerType, TransactionResult } from "./common.model";

@injectable()
export class CommonController {
  constructor(
    @inject('UserSessionService') private userSessionService: UserSessionService
  ) {}

  async checkValidSession<T>(request: UserSession): Promise<T> {
    return await this.userSessionService.checkValidSession(request);
  }

  createReturnMessage(controllerType: ControllerType , result: TransactionResult | any, request: any, methodType: MethodType, methodDetail?: string) {
    let returnMessage: Message = {
      msId: 0,
      msContent: '',
      msObject: null
    };

    switch (controllerType) {
      case ControllerType.TREE:
        if (methodType === MethodType.READ) returnMessage.msContent += '트리 ';
        else returnMessage.msContent += request.type === 10 ? '폴더 ' : '파일 ';
        break;
      case ControllerType.ISSUE:
        returnMessage.msContent += '이슈 ';
        break;
      case ControllerType.ISSUS_CHECK:
        returnMessage.msContent += '이슈체크 ';
        break;
      default:
        break;  
    }
    returnMessage.msContent += methodType;


    if (result.affectedRows !== 0 || methodType === MethodType.READ) {
      returnMessage.msId = 1;
      returnMessage.msContent += '에 성공하였습니다.';

      switch (methodType) {
        case MethodType.CREATE:
          request.id = result.insertId;
          returnMessage.msObject = request;
          break;
        case MethodType.READ:
          returnMessage.msObject = result;
          break;
        case MethodType.UPDATE:
        case MethodType.DELETE:
          returnMessage.msObject = request;
          break;
        default:
          break;
      }
    } else if (result.affectedRows === 0) {
      returnMessage.msId = 0;
      returnMessage.msContent += '에 실패하였습니다.';
    }

    methodDetail = methodDetail ? `_${methodDetail}` : '';
    if (methodType !== MethodType.READ) console.log(`메세지: \n ${returnMessage}`);
    console.log(`========================================= ${controllerType}_${methodType}${methodDetail}`);
    return returnMessage;
  }
}