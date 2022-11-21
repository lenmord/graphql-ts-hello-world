import { RequestOptions } from 'apollo-datasource-rest';
import TranslationService from '../../src/dataSources/translationService';

describe('TranslationService', () => {
  const customFetch = jest.fn();

  it('should add appropriate headers to requests', () => {
    const translationDataSource = new TranslationService(customFetch);
    translationDataSource.initialize({ context: { user: { tenant: 'APPDIRECT' } } });
    const params = new URLSearchParams();
    const headers = new Headers();
    // @ts-ignore
    const req = { path: '', params, headers } as RequestOptions;

    expect(req.headers.get('content-type')).toBe(null);
    expect(req.headers.get('AD-tenant')).toBe(null);

    translationDataSource.willSendRequest(req);
    expect(req.headers.get('content-type')).toBe('application/json');
    expect(req.headers.get('AD-tenant')).toBe('APPDIRECT');
  });

  it('should allow translations to be fetched when present', () => {
    const translationDataSource = new TranslationService(customFetch);
    const spy = jest
      .spyOn(translationDataSource, 'initialize')
      .mockImplementation(async () => translationDataSource.setTranslations({ test: 'translation' }));

    translationDataSource.initialize({ context: {} });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(translationDataSource.translate('test')).toBe('translation');
    expect(translationDataSource.translate('no.key')).toBe('no.key');
  });
});
