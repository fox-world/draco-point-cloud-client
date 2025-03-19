> Used to display the usage of `React` and `Draco`

related version:
```bash
node -v # v22.12.0

npm view react version # 19.0.0
npm view react-native version # 0.76.4

npm start # visit http://127.0.0.1:3000

# 启动文件服务器
http-server --cors
http-server --cors  -o 000010.pcd

#生成protobuf pb文件 protoc-3.17.0-win64
protoc --proto_path=./ --js_out=import_style=commonjs,binary:. ./*.proto
```

# Dynamic change base url
```bash
# Windows
set "REACT_APP_BASE_URL=http://127.0.0.1:8000" && npm start

# Linux
REACT_APP_BASE_URL='http://127.0.0.1:8000' && npm start
```

# Server Config

Specify base server url via  `static/config.json`

```json
{
	"baseURL": "http://62.234.73.155:8000"
}
```

# Docker

* Commands

  ```bash
  # build image
  docker build -t draco_client:1.0 .
  
  # run docker
  docker run -d -p 3000:3000 --name draco_client draco_client:1.0
  
  # stop docker
  docker stop draco_client && docker rm draco_client
  ```

* `Dockerfile`

  ```dockerfile
  FROM nginx
  
  COPY dist /usr/share/nginx/html
  COPY draco.conf /etc/nginx/conf.d/
  
  EXPOSE 3000
  ```

* `Nginx` configuration file

  ```nginx
  server {
      listen       3000;
      server_name  draco-server;
  
      add_header Access-Control-Allow-Origin *;
      add_header Access-Control-Allow-Methods 'GET, POST,PUT,DELETE, OPTIONS';
      add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
  
  
      location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
      }
  
      error_page   500 502 503 504  /50x.html;
      location = /50x.html {
          root   /usr/share/nginx/html;
      }
  }
  ```

  