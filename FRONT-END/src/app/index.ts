import { UserInfoService, SocketService } from './services';
import { SERVICES as COMPONENT_SERVICES } from './components';
import { COMPONENTS as COMPONENT_COMPONENTS } from './components';

export const SERVICES: any[] = [
    ...COMPONENT_SERVICES,
    UserInfoService,
    SocketService
];

export const COMPONENTS: any[] = [
    ...COMPONENT_COMPONENTS
];