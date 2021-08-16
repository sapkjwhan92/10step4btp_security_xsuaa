# Sample Secured NodeJS app on SAP CP CF

## Learning Goal

Build an application that consists of a UI (SAPUI5), AppRouter and a back-end service (NodeJS) that stores data (in memory), all of them protected by the UAA.

## Steps

1. Replace the I-number and the CF host in the manifest.yml and xs-security.json files according to your CF account.
2. Run `cf create-service xsuaa application sapcpcfdemo-uaa -c security/xs-security.json`
3. Run `cf push`
4. [Create][1] Role Collections and [assign/map][2] to users

[1]: https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/d5f1612d8230448bb6c02a7d9c8ac0d1.html
[2]: https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/9e1bf57130ef466e8017eab298b40e5e.html
