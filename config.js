/*
* Conf Variables
*
*/

//Container for enviroments

const enviroments = {
  staging: {
    'httpPort': 3000,
    'envName': 'staging'
  },
  production : {
    'httpPort': 5000,
    'envName': 'production'
  }
};

const currentEnviroment = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : '';
const enviromentToExport = enviroments[currentEnviroment] || enviroments.staging;


module.exports = enviromentToExport;