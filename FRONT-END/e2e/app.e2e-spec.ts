import { FRONTENDPage } from './app.po';

describe('front-end App', () => {
  let page: FRONTENDPage;

  beforeEach(() => {
    page = new FRONTENDPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
