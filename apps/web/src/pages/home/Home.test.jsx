import Sample from './Sample';

describe('<Sample />', () => {
  it('mounts', () => {
    // see: https://on.cypress.io/mounting-react
    
    cy.mount(<Sample />);
  });
});
