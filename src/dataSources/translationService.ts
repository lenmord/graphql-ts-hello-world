import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import logger from '../infra/lib/logger';

type Translations = {
  [key: string]: string;
};

class TranslationService extends RESTDataSource {
  translations: Translations = {};

  initialize(config) {
    super.initialize(config);
    const { user: { tenant = '', locale = '', localizationPath = '' } = {} } = config.context;
    const localizationUrl = `${localizationPath}/api/v1/translation/${tenant}/${locale}?namespace=uip-navigation-api`;
    return this.get(localizationUrl)
      .then(this.setTranslations)
      .catch(err => {
        logger.error(
          `Failed to fetch translations from localization service for partner ${tenant} and locale ${locale} with url ${localizationUrl}: ${err}`
        );
      });
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('content-type', 'application/json');
    request.headers.set('AD-tenant', this.context?.user?.tenant);
  }

  setTranslations = (translations: Translations) => {
    this.translations = translations;
  };

  translate = (key: string) => this.translations[key] || key;
}

export default TranslationService;
