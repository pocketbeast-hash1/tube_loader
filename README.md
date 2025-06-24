# Tube Loader
Расширение для браузера Google Chrome, которое позволяет скачивать видео с видеохостинга Rutube.

## Компиляция
```sh
npm run build
```

## Установка
- Перейти по ссылке "chrome://extensions/" в браузере Google Chrome
- В правом верхнем углу включить режим разработчика
- Нажать "Загрузить распакованное расширение"
- Указать путь до расширения

## Добавление новых сервисов
Если на видеохостинге ролики в формате m3u8, то есть возможность добавить модуль для загрузки с этого сервиса.

Для начала необходимо добавить новый сервис в src/enums/EServices.ts
```ts
enum EServices {
    Rutube,
    NewService, // <----
    Undefined
};
```

Затем создать три класса: ManifestRequestNewService, VideoInfoRequestNewService, VideoInfoNewService, которые будут наследоваться от ManifestRequest, VideoInfoRequest и VideoInfo соответственно.

А затем прописать зависимости в контроллере src/controllers/service-initializer.ts
```ts
export const getService = (domain: string): EServices => {
    if (ManifestRequestRutube.isValidDomain(domain)) {
        return EServices.Rutube;
    } else if (ManifestRequestNewService.isValidDomain(domain)) { // <------
        return EServices.NewService;
    }
    
    return EServices.Undefined;
};
```
```ts
export const isSegmentsInfoRequest = (url: URL): boolean => {
    return (
        ManifestRequestRutube.isSegmentsInfoRequest(url) ||
        ManifestRequestNewService.isSegmentsInfoRequest(url) // <--------
    );
};
```
```ts
export const getSegmentsInfoRequest = (url: URL, service: EServices): ManifestRequest | undefined => {
    if (service === EServices.Rutube) {
        return new ManifestRequestRutube(url);
    } else if (service === EServices.NewService) {
        return new ManifestRequestNewService(url); // <--------
    }
};
```
```ts
export const getVideoIdFromLink = (link: string, service: EServices): string | undefined => {
    if (service === EServices.Rutube) {
        return VideoInfoRequestRutube.getVideoIdFromLink(link);
    } else if (service === EServices.NewService) {
        return VideoInfoRequestNewService.getVideoIdFromLink(link); // <--------
    }
};
```
```ts
export const getVideoInfoRequest = (videoId: string, service: EServices): VideoInfoRequest | undefined => {
    if (service === EServices.Rutube) {
        return new VideoInfoRequestRutube(videoId);
    } else if (service === EServices.NewService) {
        return new VideoInfoRequestNewService(videoId); // <--------
    }
};
```
```ts
export const getVideoInfoFromObject = (obj: Object, service: EServices): VideoInfo | undefined => {
    if (service === EServices.Rutube) {
        return VideoInfoRutube.fromObject(obj);
    } else if (service === EServices.NewService) {
        return VideoInfoNewService.fromObject(obj); // <--------
    }
};
```