/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-new, no-unused-expressions */
const { expect } = require('chai');

const ApplicationValidator = require('../../../lib/validators/application_validator');

const { OptionNames, OptionValues } = require('../../../lib/core/jhipster/application_options');
const { MONOLITH, UAA, MICROSERVICE, GATEWAY } = require('../../../lib/core/jhipster/application_types');
const {
  SQL,
  MYSQL,
  POSTGRESQL,
  MONGODB,
  CASSANDRA,
  COUCHBASE,
  NEO4J
} = require('../../../lib/core/jhipster/database_types');
const JDLApplication = require('../../../lib/core/jdl_application');

describe('ApplicationValidator', () => {
  let validator;

  before(() => {
    validator = new ApplicationValidator();
  });

  describe('validate', () => {
    context('when not passing any application config', () => {
      it('fails', () => {
        expect(() => {
          validator.validate();
        }).to.throw(/^An application must be passed to be validated\.$/);
      });
    });
    context('when passing an application', () => {
      let basicValidApplicationConfig;

      beforeEach(() => {
        basicValidApplicationConfig = {
          applicationType: MONOLITH,
          authenticationType: OptionValues[OptionNames.AUTHENTICATION_TYPE].jwt,
          baseName: 'toto',
          buildTool: OptionValues[OptionNames.BUILD_TOOL].maven
        };
      });

      context('without the required options', () => {
        it('fails', () => {
          expect(() => {
            validator.validate(new JDLApplication({ config: {} }));
          }).to.throw(
            /^The application applicationType, authenticationType, baseName and buildTool options are required\.$/
          );
        });
      });
      context('with no chosen language', () => {
        it('should fail', () => {
          expect(() =>
            validator.validate(
              new JDLApplication({ config: { ...basicValidApplicationConfig, enableTranslation: true } })
            )
          ).to.throw(/^No chosen language\.$/);
        });
      });
      context('with invalid test framework values', () => {
        it('fails', () => {
          expect(() => {
            validator.validate(
              new JDLApplication({
                config: {
                  ...basicValidApplicationConfig,
                  testFrameworks: ['nothing']
                }
              })
            );
          }).to.throw(/^Unknown value 'nothing' for option 'testFrameworks'\.$/);
        });
      });
      context('with different options for databaseType, devDatabaseType and prodDatabaseType', () => {
        context('mysql', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: SQL,
                    devDatabaseType: MYSQL,
                    prodDatabaseType: MYSQL,
                    applicationType: MONOLITH
                  }
                })
              );
            }).not.to.throw();
          });
        });
        context('postgresql', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: SQL,
                    devDatabaseType: 'h2Disk',
                    prodDatabaseType: POSTGRESQL,
                    applicationType: MONOLITH
                  }
                })
              );
            }).not.to.throw();
          });
        });
        context('mongodb', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: MONGODB,
                    devDatabaseType: MONGODB,
                    prodDatabaseType: MONGODB,
                    applicationType: MONOLITH
                  }
                })
              );
            }).not.to.throw();
          });
        });
        context('cassandra', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: CASSANDRA,
                    devDatabaseType: CASSANDRA,
                    prodDatabaseType: CASSANDRA,
                    applicationType: MONOLITH
                  }
                })
              );
            }).not.to.throw();
          });
        });
        context('couchbase', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: COUCHBASE,
                    devDatabaseType: COUCHBASE,
                    prodDatabaseType: COUCHBASE,
                    applicationType: MONOLITH
                  }
                })
              );
            }).not.to.throw();
          });
        });
        context('neo4j', () => {
          it('does not fail', () => {
            expect(() => {
              validator.validate({
                config: {
                  ...basicValidApplicationConfig,
                  databaseType: NEO4J,
                  devDatabaseType: NEO4J,
                  prodDatabaseType: NEO4J,
                  applicationType: MONOLITH
                }
              });
            }).not.to.throw();
          });
        });
      });
      context('with an invalid combination for databaseType, devDatabaseType and prodDatabaseType', () => {
        context("for 'sql' as databaseType", () => {
          context('with an invalid prodDatabaseType', () => {
            it('fails', () => {
              expect(() => {
                validator.validate(
                  new JDLApplication({
                    config: {
                      ...basicValidApplicationConfig,
                      databaseType: SQL,
                      devDatabaseType: OptionValues[OptionNames.DEV_DATABASE_TYPE].h2Memory,
                      prodDatabaseType: MONGODB
                    }
                  })
                );
              }).to.throw(
                /^Only 'mysql', 'postgresql', 'mariadb', 'oracle', 'mssql' are allowed as prodDatabaseType values for databaseType 'sql'\.$/
              );
            });
          });
          context('with an invalid devDatabaseType', () => {
            it('fails', () => {
              expect(() => {
                validator.validate(
                  new JDLApplication({
                    config: {
                      ...basicValidApplicationConfig,
                      databaseType: SQL,
                      devDatabaseType: MYSQL,
                      prodDatabaseType: POSTGRESQL
                    }
                  })
                );
              }).to.throw(
                /^Only 'h2Memory', 'h2Disk', 'postgresql' are allowed as devDatabaseType values for databaseType 'sql'\.$/
              );
            });
          });
          context('with both devDatabaseType and prodDatabaseType as invalid values', () => {
            it('fails', () => {
              expect(() => {
                validator.validate(
                  new JDLApplication({
                    config: {
                      ...basicValidApplicationConfig,
                      databaseType: SQL,
                      devDatabaseType: MONGODB,
                      prodDatabaseType: MONGODB
                    }
                  })
                );
              }).to.throw(
                /^Only 'mysql', 'postgresql', 'mariadb', 'oracle', 'mssql' are allowed as prodDatabaseType values for databaseType 'sql'\.$/
              );
            });
          });
        });
        context("for either 'mongodb', 'couchbase', 'neo4j' or 'cassandra'", () => {
          context('when the devDatabaseType is not the same as the databaseType', () => {
            it('fails', () => {
              expect(() => {
                validator.validate(
                  new JDLApplication({
                    config: {
                      ...basicValidApplicationConfig,
                      databaseType: MONGODB,
                      devDatabaseType: CASSANDRA,
                      prodDatabaseType: MONGODB
                    }
                  })
                );
              }).to.throw(
                /^When the databaseType is either 'mongodb', 'couchbase', 'cassandra', 'neo4j', the devDatabaseType and prodDatabaseType must be the same\.$/
              );
            });
          });
          context('when the prodDatabaseType is not the same as the databaseType', () => {
            it('fails', () => {
              expect(() => {
                validator.validate(
                  new JDLApplication({
                    config: {
                      databaseType: MONGODB,
                      devDatabaseType: MONGODB,
                      prodDatabaseType: CASSANDRA
                    }
                  })
                );
              }).to.throw(
                /^The application applicationType, authenticationType, baseName and buildTool options are required\.$/
              );
            });
          });
          context('when the hibernate cache is enabled', () => {
            [COUCHBASE, CASSANDRA, MONGODB].forEach(databaseType => {
              context(`for ${databaseType}`, () => {
                it('should fail', () => {
                  expect(() => {
                    validator.validate(
                      new JDLApplication({
                        config: {
                          ...basicValidApplicationConfig,
                          databaseType,
                          devDatabaseType: databaseType,
                          prodDatabaseType: databaseType,
                          enableHibernateCache: true
                        }
                      })
                    );
                  }).to.throw(
                    new RegExp(
                      `An application having ${databaseType} as database type can't have the hibernate cache enabled.`
                    )
                  );
                });
              });
            });
          });
        });
      });
      context('with unknown options', () => {
        it('should fail', () => {
          expect(() =>
            validator.validate(new JDLApplication({ config: { ...basicValidApplicationConfig, toto: 42 } }))
          ).to.throw(/^Unrecognised application option name: toto\.$/);
        });
      });
      context('with unknown values', () => {
        context('because a boolean is expected', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({
                  config: { ...basicValidApplicationConfig, enableTranslation: '42', nativeLanguage: 'fr' }
                })
              )
            ).to.throw(/^Expected a boolean value for option 'enableTranslation'$/);
          });
        });
        context('because the value is unknown for a passed option', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({ config: { ...basicValidApplicationConfig, clientFramework: 42 } })
              )
            ).to.throw(/^Unknown option value '42' for option 'clientFramework'\.$/);
          });
        });
        context('because the databaseType value is unknown', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({ config: { ...basicValidApplicationConfig, databaseType: 'toto' } })
              )
            ).to.throw(/^Unknown value 'toto' for option 'databaseType'\.$/);
          });
        });
        context('because the devDatabaseType value is unknown', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({
                  config: { ...basicValidApplicationConfig, databaseType: 'sql', devDatabaseType: 'toto' }
                })
              )
            ).to.throw(/^Unknown value 'toto' for option 'devDatabaseType'\.$/);
          });
        });
        context('because the prodDatabaseType value is unknown', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({
                  config: {
                    ...basicValidApplicationConfig,
                    databaseType: 'sql',
                    devDatabaseType: 'mysql',
                    prodDatabaseType: 'toto'
                  }
                })
              )
            ).to.throw(/^Unknown value 'toto' for option 'prodDatabaseType'\.$/);
          });
        });
      });
      context('with a name containing an underscore', () => {
        context('with a UAA application', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({
                  config: { ...basicValidApplicationConfig, baseName: 'test_app', applicationType: UAA }
                })
              )
            ).to.throw(
              /^An application name can't contain underscores if the application is a microservice or a UAA application\.$/
            );
          });
        });
        context('with a microservice application', () => {
          it('should fail', () => {
            expect(() =>
              validator.validate(
                new JDLApplication({
                  config: { ...basicValidApplicationConfig, baseName: 'test_app', applicationType: MICROSERVICE }
                })
              )
            ).to.throw(
              /^An application name can't contain underscores if the application is a microservice or a UAA application\.$/
            );
          });
        });
        context('with any other application type', () => {
          context('such as a gateway', () => {
            it('should not fail', () => {
              expect(() =>
                validator.validate(
                  new JDLApplication({
                    config: { ...basicValidApplicationConfig, baseName: 'test_app', applicationType: GATEWAY }
                  })
                )
              ).not.to.throw();
            });
          });
          context('such as a monolith', () => {
            it('should not fail', () => {
              expect(() =>
                validator.validate(
                  new JDLApplication({
                    config: { ...basicValidApplicationConfig, baseName: 'test_app', applicationType: MONOLITH }
                  })
                )
              ).not.to.throw();
            });
          });
        });
      });
    });
  });
});
