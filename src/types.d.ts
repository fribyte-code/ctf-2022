import Team from './models/team';

declare global {
    namespace Express {
        interface Request {
            team?: Team;
            selectedNavigationItem?: string;
        }
    }
}
