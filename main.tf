terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {}

resource "docker_image" "alpha" {
  name         = "alpha:latest"
  build {
    context    = "${path.module}"
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "test1" {
  name  = "test1"
  image = docker_image.alpha.latest
  ports {
    internal = 5000
    external = 5001
  }
  restart = "unless-stopped"
}

resource "docker_container" "test2" {
  name  = "test2"
  image = docker_image.alpha.latest
  ports {
    internal = 5000
    external = 5002
  }
  restart = "unless-stopped"
}
