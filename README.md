# Github Actions for Building and Deploying Rig Capsules

[Rig](https://docs.rig.dev) is an open-source application platform for Kubernetes. Rig has a concept of Capsules which is a self-contained deployable unit of your application.
These two actions are for building and deploying such Rig capsules from a Docker image.

## Build

The Rig build is created from a Docker image. Thus often your build/deploy Github workflow would first have an action to create and publish a Docker image from the Git commit. See [here](https://docs.docker.com/build/ci/github-actions) for Docker's Github actions.

### Usage

See [action.yml](https://github.com/rigdev/actions/blob/main/deploy/action.yml).

```yaml
- uses: rigdev/actions/build@v1
  with:
    # The client ID of a service account in the project which your capsule resides in.
    # The capsule you want to deploy to is in some Rig project. To this project you can
    # create service accounts which gives admin rights over the project.
    clientID: ""

    # The client secret of a service account in the project which your capsule resides in.
    clientSecret: ""

    # An URL accessible from the outside to your Rig cluster. The action, which runs in a
    # Github hosted machine, will communicate with your Rig cluster on this URL.
    url: ""

    # The Docker image which you want to deploy to your capsule
    image: ""

    # The ID of the capsule which you want to deploy to.
    capsuleID: ""

    # The ID which the Rig build should be given. If given, the build ID will be the first 10 characters
    # of the Git commit SHA
    buildID: ""
```

## Deploy

The Deploy action would often be used after the Build action and use the `buildID` output from it.

### Usage

```yaml
- uses: rigdev/actions/deploy@v1
  with:
    # The client ID of a service account in the project which your capsule resides in.
    # The capsule you want to deploy to is in some Rig project. To this project you can
    # create service accounts which gives admin rights over the project.
    clientID: ""

    # The client secret of a service account in the project which your capsule resides in.
    clientSecret: ""

    # An URL accessible from the outside to your Rig cluster. The action, which runs in a
    # Github hosted machine, will communicate with your Rig cluster on this URL.
    url: ""

    # The ID of the Rig build which you wish to deploy to your capsule
    buildID: ""

    # The ID of the capsule which you want to deploy to.
    capsuleID: ""
```

## Example

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Build Rig
        uses: rigdev/actions/build@v1
        id: build_rig
        with:
          clientID: YOUR_ID
          clientSecret: YOUR_SECRET
          url: url-to-rig-cluster
          image: DOCKER_IMAGE
          capsuleID: CAPSULE_ID
      - name: Deploy to capsule
        uses: rigdev/actions/deploy@v1
        with:
          clientID: YOUR_ID
          clientSecret: YOUR_SECRET
          url: url-to-rig-cluster
          capsuleID: CAPSULE_ID
          buildID: ${{ steps.build_rig.outputs.buildID }}
```
