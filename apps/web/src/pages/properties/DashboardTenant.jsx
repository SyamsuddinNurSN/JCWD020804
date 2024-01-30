import { ListPropertyTenant } from './RightBar/ListProperty';
import { RightBarTenant } from './RightBarTenant';
import { SidebarTenant } from './SidebarTenant';
import { TestProps } from './TestProps';

export const DashboardTenant = ({ checkState }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row justify-evenly items-center">
        <SidebarTenant />
        <RightBarTenant stateRightBar={1} />
        <Date stateInDashboard={0} />
        {/* <TestProps propName={'tes'}></TestProps> */}
        {/*
        <ListPropertyTenant /> */}
        {/* List Property Sini! */}
      </div>
      
    </div>
  );
};
