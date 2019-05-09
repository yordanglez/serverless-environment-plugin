'use strict';
const _ = require("lodash")
var fs = require("fs");

class EnvironmentPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        this.commands = {
            test_command: {
                usage: 'Helps you start your first Serverless plugin',
                lifecycleEvents: [
                    'replace'
                ]
            },
        };

        this.hooks = {
            'after:test_command:replace': this.includeEnvironment.bind(this),
            'after:deploy:initialize': this.includeEnvironment.bind(this),
        };
    }

    includeEnvironment() {

        var stage = _.get(this.serverless, 'service.custom.environmentPlugin.stage',
            this.serverless.service.provider.stage);
        var pathEnv = _.get(this.serverless, 'service.custom.environmentPlugin.pathEnv', '');
        if (pathEnv != '' && pathEnv[pathEnv.leading - 1] != '/')
            pathEnv = pathEnv + "/"
        var local_env = JSON.parse(fs.readFileSync(`${pathEnv}environments.${stage}.json`));

        this.serverless.service.provider.environment = _.extend(local_env, this.serverless.service.provider.environment)
        this.serverless.cli.log(JSON.stringify(this.serverless.service.provider.environment = _.extend(local_env, this.serverless.service.provider.environment)));

    }
}


module.exports = EnvironmentPlugin;
