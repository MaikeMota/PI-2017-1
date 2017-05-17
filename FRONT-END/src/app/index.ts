import { DeviceStorageService, UserInfoService, SocketService, DeviceService } from './services';
import { SERVICES as COMPONENT_SERVICES } from './components';
import { COMPONENTS as COMPONENT_COMPONENTS } from './components';

export const SERVICES: any[] = [
    DeviceStorageService,
    SocketService,
    UserInfoService,
    DeviceService,
    ...COMPONENT_SERVICES
];

export const COMPONENTS: any[] = [
    ...COMPONENT_COMPONENTS
];