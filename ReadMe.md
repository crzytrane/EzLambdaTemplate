# Usage

- Clone the repo `git clone https://github.com/crzytrane/EzLambdaTemplate`
- Install the template using `dotnet new --install ./EzLambdaTemplate`
- Use the template `dotnet new rml --name MyApp`
- Change directory to the app we created `cd MyApp`
- Now we fix up the ClientApp packages
  - Navigate to `cd src/ClientApp`
  - Run `npm ci`
- Prep the infra folder
  - Navigate to `cd infra`
  - Run `npm install`
- At the root run `./build_and_deploy.bat`
- Deploy to AWS `cdk deploy`
