import { ListPropertyTenant } from './RightBar/ListProperty';

export const RightBarTenant = ({ stateRightBar }) => {
  const DASHBOARD = 0;
  const LIST_PROPERTY = 1;
  const renderRightBar = (stateRightBar) => {
    switch (stateRightBar) {
      case DASHBOARD: {
        return 'ini Dashboard!';
      }
      case LIST_PROPERTY: {
        return <ListPropertyTenant />;
      }
    }
  };
  return <div>{renderRightBar(stateRightBar)}</div>;
};
