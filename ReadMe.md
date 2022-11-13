# Usage

- Clone the repo `git clone https://github.com/crzytrane/EzLambdaTemplate`
- Install the template using `dotnet new install ./EzLambdaTemplate`
- Use the template `dotnet new rml --name MyApp`
- Now we fix up the ClientApp packages
  - Navigate to `cd src/ClientApp`
  - Run `npm ci`
- At the root run `./build_and_deploy.bat`
- Deploy to AWS `cdk deploy`
