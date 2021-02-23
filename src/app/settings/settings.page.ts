import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Storage} from '@ionic/storage';
import {Plugins} from '@capacitor/core';

const {Modals, Toast} = Plugins;

@AutoUnsubscribe()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public serverUrl;

  constructor(
    private readonly storage: Storage,
  ) {
  }

  async ngOnInit() {
    this.serverUrl = await this.storage.get('server');
  }

  public async changeServerUrl() {
    const {value} = await Modals.prompt({
      message: 'Server url',
      title: 'Server',
      cancelButtonTitle: 'Cancel',
      okButtonTitle: 'save'
    });

    if (!!value?.match(`[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)`) ||
      !!value?.match(`^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$`)) {
      this.serverUrl = value;
      this.storage.set('server', this.serverUrl);
    } else {
      await Toast.show({
        text: 'Enter a valid server url',
        duration: 'long',
        position: 'bottom'
      });
    }


  }

  ngOnDestroy(): void {
  }

}
