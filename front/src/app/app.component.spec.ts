
import { AppComponent } from './app.component';
import { LoadingService } from './shared/services/loading/loading.service';

describe('AppComponent', () => {
  let appComponent: AppComponent;
  const loading = {} as LoadingService;

  const createComponent = () => {
    appComponent = new AppComponent(loading);
  };

  it('should create component', () => {
    createComponent();
    expect(appComponent).toBeDefined();
  });
});
