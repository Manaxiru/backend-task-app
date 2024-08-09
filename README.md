# Backend Task App
Backend Task App Challenge

## Comentarios sobre el desarrollo
### Frontend
De este lado, las decisiones de diseño a nivel de colores fueron tomadas de la paleta suministrada en este template, con adición de algunas paletas generadas por el [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).

Con respecto a las herramientas de Angular, decidí usar para el desarrollo en su mayor parte las características que ofrecen las versiones +17 (Signals, Built-in control flow…), en algunos componentes al 100%, en otros al 50% y otros con solo las características ya conocidas de versiones anteriores, hecho de esta forma para demostrar como acostumbro a implementar las características del lenguaje en sus diferentes versiones.

En resoluciones más amplias decidí implementar además de la casilla de verificación (ícono de check), la funcionalidad de Drag & Drop para también arrastrar las tareas y completarlas o colocarlas en pendiente respectivamente. En resoluciones más bajas, se desactiva esta opción pero se habilitan los paneles para priorizar mostrar más tareas en pantalla.

La URL de la aplicación en producción en Firebase Hosting es la siguiente [Task App](https://hola-a9e75.web.app).

### Backend
Aquí me encontré con complicación debido a mi país de residencia que me imposibilita usar mis tarjetas de crédito u otros métodos de pago para poder utilizar el servicio de Firebase Cloud Functions, indicado en el documento del reto.

Debido a esto tomé otro enfoque del reto usando otra plataforma SaaS, Netlify; que también posee servicios similares para las funciones backendless o cloud functions, usando estás para comunicarme con el SaaS de Firebase y usar los servicios que se indican en el documento (Firebase Firestore), así como también el servicio de autentificación (Firebase Authentication).

La URL de las funciones generadas por Netlify como una API están en los siguientes enlaces con su respectiva documentación en postman; [API](https://maug-task-app.netlify.app/api), [Documentación POSTMAN](https://documenter.getpostman.com/view/13544160/2sA3s1osHa).