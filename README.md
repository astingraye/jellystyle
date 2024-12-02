# jellystyle
## Easily manage your jellyfin css from a selfhosted service
### Rundown
Essentially, this is a organiser/server for scss files (but I made and use it for jellyfin, so it's named that way).
It merges all files in jellystyle/styles, and logs them with fancy metadata/error notices.
So just boot up the docker file, reverse proxy it with something like caddy and `@import` it in jellyfin