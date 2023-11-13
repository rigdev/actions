# Github Actions for Building and Deploying Rig Capsules

[Rig](https://docs.rig.dev) is an application platform for Kubernetes. Rig has a concept of Capsules which is a self-contained deployable unit of your application.
These two actions are for building and deploying such Rig capsules from a Docker image.

## Build

The Rig build is a thin wrapper over a Docker image. Thus often your build/deploy Github workflow would first have an action to create and publish a Docker image from the Git commit. See [here](https://docs.docker.com/build/ci/github-actions) for Docker's Github actions.

### Usage

See [action.yml](https://github.com/rigdev/actions/blob/main/build/action.yml).

```yaml
- uses: rigdev/actions/build@v3
  with:
    # An URL accessible from the outside to your Rig cluster. The action, which runs in a
    # Github hosted machine, will communicate with your Rig cluster on this URL.
    url: ""

    # The capsule you want to deploy is in some Rig project.
    project: ""

    # The client ID of a service account in the project which your capsule resides in.
    # To this project you can create service accounts which gives admin rights over the project.
    clientID: ""

    # The client secret of a service account in the project which your capsule resides in.
    clientSecret: ""

    # The Docker image which you want to deploy to your capsule
    image: ""

    # The name of the capsule which you want to deploy to.
    capsule: ""

    # Set to 'true' if you don't want Rig to validate that the docker image exists.
    skipImageCheck: ""

    # Set to 'true' if you want to deploy the Rig build as well to the capsule
    deploy: ""

    # Required if 'deploy' is true. Sets the environment in which the build will be deployed
    environment: ""

    # Only used if 'deploy' is true. If true, does not execute a deploy but returns the changes that would be made
    dryRun: ""

    # Only used if 'deploy' is true. If true will force-abort the current rollout if it hasn't succeded yet
    force:
```

### Outputs:
| Name          | Type   | Description                                            |
|---------------|--------|--------------------------------------------------------|
| build         | string | The ID of the build created                            |
| rolloutConfig | JSON   | If 'deploy' is true, the Configuration of the rollout. |

## Deploy

The Deploy action would often be used after the Build action and use the `build` output from it.

### Usage

See [action.yml](https://github.com/rigdev/actions/blob/main/deploy/action.yml).

```yaml
- uses: rigdev/actions/deploy@v3
  with:
    # An URL accessible from the outside to your Rig cluster. The action, which runs in a
    # Github hosted machine, will communicate with your Rig cluster on this URL.
    url: ""

    # The capsule you want to deploy is in some Rig project.
    project: ""

    # The client ID of a service account in the project which your capsule resides in.
    # To this project you can create service accounts which gives admin rights over the project.
    clientID: ""

    # The client secret of a service account in the project which your capsule resides in.
    clientSecret: ""

    # The name of the capsule which you want to deploy to.
    capsule: ""

    # The ID of the Rig build which you wish to deploy to your capsule
    build: ""

    # If true, does not execute a deploy but returns the changes that would be made
    dryRun: ""

    # If true will force-abort the current rollout if it hasn't succeded yet
    force: ""
```

### Outputs
| Name          | Type   | Description                                            |
|---------------|--------|--------------------------------------------------------|
| rolloutConfig | JSON   | If 'deploy' is true, the Configuration of the rollout. |

## Example

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Create build on Rig
        uses: rigdev/actions/build@v3
        id: build_rig
        with:
          url: url-to-rig-cluster
          project: YOUR_PROJECT_NAME
          clientID: YOUR_ID
          clientSecret: YOUR_SECRET
          image: DOCKER_IMAGE
          capsule: YOUR_CAPSULE
      - name: Deploy to capsule
        uses: rigdev/actions/deploy@v3
        with:
          url: url-to-rig-cluster
          project: YOUR_PROJECT_NAME
          environement: YOUR_ENVIRONMENT
          clientID: YOUR_ID
          clientSecret: YOUR_SECRET
          capsule: YOUR_CAPSULE
          build: ${{ steps.build_rig.outputs.build }}
```

## Example with first pushing a Docker image from the commit just committed

This is the most common pattern. You've committed a changed you want to deploy to your capsule. First you build a docker image of the commit, push it to Dockerhub and then deploy to the capsule.

In this example a username and password to Dockerhub is stored as a Github secret in the repository of the workflow. The same is done with the client secret to the Rig project

```yaml
on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_PASSWORD }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/DOCKER_IMAGE_NAME:latest

      - name: Create build on Rig
        uses: rigdev/actions/build@v3
        id: build_rig
        with:
          url: url-to-rig-cluster
          project: YOUR_PROJECT_NAME
          clientID: YOUR_ID
          clientSecret: ${{ secrets.RIG_PROJECT_CLIENT_SECRET }}
          image: ${{ secrets.DOCKER_HUB_USERNAME }}/DOCKER_IMAGE_NAME:latest
          capsule: YOUR_CAPSULE

      - name: Deploy to capsule
        uses: rigdev/actions/deploy@v3
        with:
          url: url-to-rig-cluster
          project: YOUR_PROJECT_NAME
          environement: YOUR_ENVIRONMENT
          clientID: YOUR_ID
          clientSecret: ${{ secrets.RIG_PROJECT_CLIENT_SECRET }}
          capsule: YOUR_CAPSULE
          build: ${{ steps.build_rig.outputs.build }}
```
