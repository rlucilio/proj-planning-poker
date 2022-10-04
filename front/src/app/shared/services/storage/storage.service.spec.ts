import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storageService: StorageService;

  const createService = () => {
    storageService = new StorageService();
  };

  it('verify method setValue success scenario', () => {
    const key = 'key';
    const value = 'value';

    createService();
    storageService.setValue(key, value);

    const result = window.sessionStorage.getItem(key);

    expect(result).toEqual(value);
  });

  it('verify method setValue error', () => {
    const key = '';
    const value = 'value';

    createService();

    expect(() => {
      storageService.setValue(key, value);
    }).toThrow('Params invalid');
  });

  it('verify method setObject success scenario', () => {
    const key = 'key';
    const value = { prop: 'value' };

    createService();
    storageService.setObject(key, value);
    const result = window.sessionStorage.getItem(key);

    expect(result).toEqual(JSON.stringify(value));
  });

  it('verify method setObject error', () => {
    const key = '';
    const value =  null;

    createService();

    expect(() => {
      storageService.setObject(key, value);
    }).toThrow('Params invalid');
  });

  it('verify method getObject', () => {
    const key = 'key';
    window.sessionStorage.setItem(key, JSON.stringify({ prop: 'value' }));

    createService();
    const result = storageService.getObject(key);

    expect(result).toEqual({ prop: 'value' });
  });

  it('verify method getObject error', () => {
    const key = '';
    window.sessionStorage.setItem(key, JSON.stringify({ prop: 'value' }));

    createService();

    expect(() => {
      storageService.getObject(key);
    }).toThrowError('key invalid');
  });

  it('verify method getValue', () => {
    const key = 'key';
    window.sessionStorage.setItem(key, 'value' );

    createService();

    const result = storageService.getValue(key);

    expect(result).toEqual('value');
  });

  it('verify method getValue error', () => {
    const key = '';
    window.sessionStorage.setItem(key, 'value' );

    createService();

    expect(() => {
      storageService.getValue(key);
    }).toThrowError('key invalid');
  });

  it('verify method clear', () => {
    window.sessionStorage.setItem('key', 'value' );

    createService();
    storageService.clear();

    expect(window.sessionStorage.length).toEqual(0);
  });
});
