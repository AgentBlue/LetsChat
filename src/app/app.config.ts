import { environment } from "../environment/environment"
import { InjectionToken } from "@angular/core"

export let APP_CONFIG = new InjectionToken('app.config')

export class IAppConfig {
  static config: any
  openAiApiKey!: string
  baseUrl!: string  
  

  public static LoadConfig() {
    const xmlhttp = new XMLHttpRequest()
    const configUrl = `${environment.baseHref}/configs/${environment.envName}.config.json?nocache=${(new Date()).getTime()}`

    xmlhttp.open('GET', configUrl, false)
    xmlhttp.overrideMimeType('application/json')
    xmlhttp.send()
    if (xmlhttp.status === 200) {
      this.config = JSON.parse(xmlhttp.responseText)
      return ''
    } else {
      return null
    }
  }

  public static getEnvironmentVariable(variableName: string, isRelativeUrl: boolean) {

    if (!this.config) {
      this.LoadConfig()
    }
    if (environment.envName !== 'local' && isRelativeUrl) {
      return document.location.origin + this.config[variableName]
    } else {
      return this.config[variableName]
    }
  }
}

export const AppConfig: IAppConfig = {
  baseUrl: environment.baseHref,
  openAiApiKey: IAppConfig.getEnvironmentVariable('openAiApiKey', false),
}
