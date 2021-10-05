FROM ubuntu
RUN apt-get update && apt-get install -y curl unzip nodejs jq miller apt-transport-https ca-certificates gnupg

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y


# install snowsql
RUN groupadd --system snowflake --gid 444 && \
useradd --uid 444 --system --gid snowflake --home-dir /usr/snowflake --create-home --shell /sbin/nologin --comment "Docker image user" snowflake && \
chown -R snowflake:snowflake /usr/snowflake

ADD . /usr/snowflake
WORKDIR /usr/snowflake

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV VERSION 1.2.17
ENV BOOTSTRAP_VERSION 1.2
ENV SNOWSQL_DEST /usr/local/bin
ENV SNOWSQL_LOGIN_SHELL /usr/snowflake/.bashrc

RUN curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/"${BOOTSTRAP_VERSION}"/linux_x86_64/snowsql-"${VERSION}"-linux_x86_64.bash
RUN bash snowsql-${VERSION}-linux_x86_64.bash
USER snowflake
RUN snowsql -v

ENV PORT 8080

COPY . .

CMD [ "node", "server.js" ]