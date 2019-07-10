dotnet publish -c Release 

xcopy /y dockerfile .\bin\release\netcoreapp2.2\publish

docker build -t oh-the-places-you-image ./bin/release/netcoreapp2.2/publish

docker tag oh-the-places-you-image registry.heroku.com/oh-the-places-you/web

docker push registry.heroku.com/oh-the-places-you/web

heroku container:release web -a oh-the-places-you

# sudo chmod 755 deploy.sh
# ./deploy.sh