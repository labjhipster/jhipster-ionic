npm i -g generator-jhipster @ionic/cli @angular/cli generator-jhipster-ionic yo@4.0.0-beta.0

yo jhipster-ionic
yo jhipster-ionic:import-jdl blog.jh 

yo jhipster-ionic:entity tag
yo jhipster-ionic:entity post
yo jhipster-ionic:entity blog

./mvnw -Dskip.npm

cambios:
  - environment.ts: 
        apiUrl: 'https://8080-lime-camel-gstunjuy.ws-eu03.gitpod.io/api',
  - application-dev.yml
        allowed-origins: 'http://localhost:8100,http://localhost:9000,https://8080-lime-camel-gstunjuy.ws-eu03.gitpod.io,https://8100-lime-camel-gstunjuy.ws-eu03.gitpod.io'


nota: hacer públicos los puertos
