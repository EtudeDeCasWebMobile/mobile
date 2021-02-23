import {Component, OnInit} from '@angular/core';
import {from} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AlertController, MenuController} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {Router} from '@angular/router';

const {Modals} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly menuController: MenuController
  ) {
  }

  ngOnInit(): void {
    from(this.storage.get('server'))
      .subscribe(async (result) => {
        if (!result) {
          const value = await this.showPrompt();
          console.log(value?.value);
          await this.storage.set('server', value.value);
        }
      });
  }

  async showPrompt() {

    let promptRet = await Modals.prompt({
      title: 'Add a server',
      message: `Add a server URL/IP address`
    });
    if (!(!!promptRet?.value?.match(`[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)`) ||
      !!promptRet?.value?.match(`^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$`))) {
      promptRet = await this.showPrompt();
    }
    return promptRet;

  }

  public navigate(s: string) {
    this.router.navigateByUrl(s);
    this.menuController.close();
  }

}
