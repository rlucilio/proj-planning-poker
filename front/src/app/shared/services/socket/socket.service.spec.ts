import { SocketService } from './socket.service';



describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const createComponent = () => {
    service = new SocketService();
  };

  it('should be created', () => {
    createComponent();
    expect(service).toBeDefined();
  });
});
