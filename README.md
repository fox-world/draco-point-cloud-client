> Using `threejs` to render point cloud data via `pcd` and `drc` format

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

```bash
# build image
docker build -t lucumt/draco_client:1.0 .

# run docker
docker run -d -p 3000:3000 --name draco_client lucumt/draco_client:1.0

# stop docker
docker stop draco_client && docker rm draco_client
```

# Render

* `pcd` file render

  ![pcd ply](/public/pcd_play.gif "pcd ply") 

* `drc`file render

  ![drc ply](/public/pcd_play.gif "drc ply") 

