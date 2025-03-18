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