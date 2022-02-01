import { Container } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { CommonController } from '../common/common.controller';
import { CommonService } from '../common/common.service';

import { TreeController } from '../tree/tree.controller';
import { TreeService } from '../tree/tree.service';
import { TreeRepository } from '../tree/tree.repository';

import { IssueCheckController } from '../issue/issueCheck.controller';
import { IssueCheckService } from '../issue/issueCheck.service';
import { IssueCheckRepository } from '../issue/issueCheck.repository';

import { IssueController } from '../issue/issue.controller';
import { IssueService } from '../issue/issue.service';
import { IssueRepository } from '../issue/issue.repository';

import { IssueStateHistoryRepository } from '../issue/issueStateHistory.repository';

import { FileController } from '../common/file.controller';
import { TreeFileController } from '../tree/treeFile.controller';

import { AWSFileUploader } from '../file/awsFileUploader';
import { RemoteFileUpload } from '../file/remoteFileUpload';

const container = new Container();

try {
    container.bind<CommonRepository>('CommonRepository').to(CommonRepository);
    container.bind<DBConnectionFactory>('mysqlPool').to(DBConnectionFactory);
    container.bind<CommonController>('CommonController').to(CommonController);
    container.bind<CommonService>('CommonService').to(CommonService);


    container.bind<TreeController>('TreeController').to(TreeController);
    container.bind<TreeService>('TreeService').to(TreeService);
    container.bind<TreeRepository>('TreeRepository').to(TreeRepository);

    container.bind<IssueCheckController>('IssueCheckController').to(IssueCheckController);
    container.bind<IssueCheckService>('IssueCheckService').to(IssueCheckService);
    container.bind<IssueCheckRepository>('IssueCheckRepository').to(IssueCheckRepository);

    container.bind<IssueController>('IssueController').to(IssueController);
    container.bind<IssueService>('IssueService').to(IssueService);
    container.bind<IssueRepository>('IssueRepository').to(IssueRepository);

    container.bind<IssueStateHistoryRepository>('IssueStateHistoryRepository').to(IssueStateHistoryRepository);

    container.bind<FileController>('FileController').to(FileController);
    container.bind<TreeFileController>('TreeFileController').to(TreeFileController);

    container.bind<AWSFileUploader>("AWSFileUploader").to(AWSFileUploader);
    container.bind<RemoteFileUpload>("RemoteFileUpload").to(RemoteFileUpload);

} catch (error) {
    throw error;
}

export { container };