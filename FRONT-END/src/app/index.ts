import { UserInfoService } from './services';
import { SERVICES as COMPONENT_SERVICES } from './components';
import { COMPONENTS as COMPONENT_COMPONENTS } from './components';

export const SERVICES: any[] = [
    ...COMPONENT_SERVICES,
    UserInfoService
];

export const COMPONENTS: any[] = [
    ...COMPONENT_COMPONENTS
];