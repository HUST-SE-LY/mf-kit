# MF-Kit: A CLI Tool for Creating Micro Apps with Module Federation 2.0

🚧 This project is still under development!

MF-Kit is a CLI tool designed to help you create and manage micro apps using Module Federation 2.0.

## To-Do List

- [x] CLI to generate templates
- [x] CLI to add exposed components
- [x] CLI to add remotes
- [x] CLI to manage routes
- [ ] Monorepo to manage micro-apps
- [ ] CLI to publish application

Stay tuned for updates!

## Usage

### Create Module Federation App

```shell
mf-kit init
```

### Create Micro-App

```shell
mf-kit init-micro-app
```

### Expose a Module

```shell
mf-kit expose <remotePath> <localPath>
```

### Add a Remote Url to Current App

```shell
mf-kit add-remote <name> <url>
```
