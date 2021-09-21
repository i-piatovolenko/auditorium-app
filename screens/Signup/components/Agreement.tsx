import React from 'react';
import {Button, Dialog, Paragraph, Portal, Title} from "react-native-paper";
import {ScrollView, StyleSheet, Text, Dimensions, View} from "react-native";
import Colors from "../../../constants/Colors";

const WINDOW_HEIGHT = Dimensions.get('window').height;

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  setCheckAgreement: (value: boolean) => void;
}

export default function Agreement({visible, hideDialog, setCheckAgreement}: PropTypes) {
  return <Portal>
    <Dialog visible={visible} onDismiss={hideDialog} style={styles.wrapper}>
      <Dialog.Title>Умови користування</Dialog.Title>
      <Dialog.Content>
        <ScrollView style={{height: WINDOW_HEIGHT * .75}}>
          <Title> Політика конфіденційності </Title>
          <Paragraph> Останнє оновлення: 25 серпня 2021 р.</Paragraph>
          <Paragraph> Ця Політика конфіденційності описує нашу політику та процедури щодо збору, використання та
            розкриття
            вашої
            інформації під час користування Сервісом та розповідає вам про ваші права на конфіденційність та про те, як
            закон
            захищає вас. </Paragraph>
          <Paragraph> Ми використовуємо Ваші персональні дані для надання та покращення Послуги. Користуючись Послугою,
            ви
            погоджуєтесь на
            збір та використання інформації відповідно до цієї Політики конфіденційності.</Paragraph>
          <Title> Інтерпретація та визначення </Title>
          <Title> Інтерпретація </Title>
          <Paragraph> Слова, у яких початкова буква написана з великої букви, мають значення, визначені за таких умов.
            Наступні визначення
            мають однакове значення незалежно від того, чи входять вони в однині чи множині. </Paragraph>
          <Title style={{fontSize: 16}}> Визначення </Title>
          <Paragraph> Для цілей цієї Політики конфіденційності: </Paragraph>

          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Обліковий запис </Text> означає унікальний обліковий запис,
              створений для доступу до нашого
              Сервісу або частин нашого Сервісу. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Додаток </Text> означає програмне забезпечення, надане
              Компанією, завантажене Вами на будь -якому
              електронному пристрої під назвою Auditorium </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Компанія </Text> (в даній Угоді також згадується як
              "Компанія",
              "Ми", "Ми" або "Наша" або
              "Auditorium"). </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Країна </Text> відноситься до: Україна </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Пристрій </Text> означає будь -який пристрій, який має доступ
              до
              Доатку, наприклад комп’ютер,
              мобільний телефон або цифровий планшет. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Особисті дані </Text> - це будь -яка інформація, що стосується
              ідентифікованої особи або особи, що
              ідентифікується. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Послуга </Text> відноситься до Програми. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Постачальник послуг </Text> означає будь -яку фізичну або
              юридичну особу, яка обробляє дані від
              імені Компанії. Він відноситься до сторонніх компаній або приватних осіб, зайнятих Компанією для сприяння
              Службі, надання Послуги від імені Компанії, для надання послуг, пов'язаних із Послугою, або для надання
              допомоги Компанії в аналізі використання Сервісу. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Дані про використання </Text> відносяться до даних, зібраних
              автоматично, або генерованих шляхом
              використання Сервісу, або з інфраструктури самої Сервісу (наприклад, тривалість відвідування сторінки).
            </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Ви </Text> означає фізичну особу, яка отримує доступ або
              користується Послугою, або компанію чи
              іншу юридичну особу, від імені якої така особа отримує доступ або користується Службою, якщо це можливо.
            </Paragraph>
          </Paragraph>

          <Title> Збір та використання ваших особистих даних </Title>
          <Title style={{fontSize: 16}}> Типи зібраних даних </Title>
          <Title style={{fontSize: 14}}>Особисті дані </Title>
          <Paragraph> Під час користування нашим Сервісом ми можемо попросити вас надати нам певну особисту інформацію,
            яка може бути
            використана для зв’язку або ідентифікації вас. Інформація, що ідентифікує особу, може включати, але не
            обмежуватися
            ними: </Paragraph>

          <Paragraph>
            <Paragraph> Адреса електронної пошти </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph> Ім'я та прізвище </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph> Номер телефону </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph> Дані про місце Вашого навчання або роботи </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph> Дані використання </Paragraph>
          </Paragraph>

          <Title style={{fontSize: 14}}>Дані використання </Title>
          <Paragraph> Дані про використання збираються автоматично під час використання Сервісу. </Paragraph>
          <Paragraph> Дані про використання можуть включати таку інформацію, як адреса Інтернет -протоколу вашого
            пристрою
            (наприклад, IP
            -адреса), тип веб -переглядача, версія браузера, сторінки нашої Служби, які ви відвідуєте, час і дата вашого
            відвідування, час, витрачений на ці сторінки , унікальні ідентифікатори пристрою та інші діагностичні
            дані. </Paragraph>
          <Paragraph> Коли ви отримуєте доступ до Служби через або через мобільний пристрій, ми можемо автоматично
            збирати
            певну
            інформацію, включаючи, але не обмежуючись, тип мобільного пристрою, яким ви користуєтесь, унікальний
            ідентифікатор
            вашого мобільного пристрою, IP -адресу вашого мобільного пристрою , Ваша мобільна операційна система, тип
            мобільного
            Інтернет -браузера, який ви використовуєте, унікальні ідентифікатори пристрою та інші діагностичні
            дані. </Paragraph>
          <Paragraph> Ми також можемо збирати інформацію, яку надсилає ваш веб -переглядач, коли ви відвідуєте наш
            Сервіс
            або коли ви
            отримуєте доступ до Служби за допомогою мобільного пристрою або через нього. </Paragraph>
          <Title style={{fontSize: 16}}> Використання ваших особистих даних </Title>
          <Paragraph> Компанія може використовувати Персональні дані для таких цілей: </Paragraph>

          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Для надання та підтримки нашого Застосунку </Text>, зокрема
              для
              контролю за його використанням.
            </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Щоб керувати своїм обліковим записом: </Text> керуйте своєю
              реєстрацією як користувач Додатку.
              Надані Вами персональні дані можуть надати Вам доступ до різних функцій Сервісу, які доступні Вам як
              зареєстрованому користувачу. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Щоб зв’язатися з Вами: </Text> Щоб зв’язатися з Вами
              електронною
              поштою, телефонними дзвінками,
              SMS або іншими еквівалентними формами
              електронного зв'язку, наприклад, push -сповіщення мобільних додатків щодо оновлень або інформативні
              комунікації, пов'язані з функціональними можливостями, продуктами або контрактними послугами, включаючи
              безпеку
              оновлення, коли це необхідно або розумно для їх впровадження. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Щоб надати Вам </Text> новини, спеціальні пропозиції та
              загальну
              інформацію про інші товари,
              послуги
              та події, які ми пропонуємо, подібні до тих, які ви вже придбали чи запитали про них, крім випадків, коли
              це
              відбувається
              Ви вирішили не отримувати таку інформацію. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> Щоб керувати Вашими запитами: </Text> Щоб відвідувати та
              керувати Вашими запитами до нас. </Paragraph>
          </Paragraph>
          <Paragraph>
            <Paragraph><Text style={{fontWeight: '600'}}> В інших цілях </Text>: Ми можемо використовувати Вашу
              інформацію
              в інших цілях, таких як аналіз
              даних,
              визначення тенденцій використанняб оцінка та
              покращення наших послуг.</Paragraph>
          </Paragraph>

          <Paragraph> Ми можемо передавати Вашу особисту інформацію у таких ситуаціях: </Paragraph>

          <Paragraph><Text style={{fontWeight: '600'}}> З постачальниками послуг. </Text> Ми можемо передавати Вашу
            особисту інформацію постачальникам послуг
            відстежувати та аналізувати використання нашого Сервісу, щоб зв’язатися з Вами.
          </Paragraph>
          <Paragraph><Text style={{fontWeight: '600'}}> З діловими партнерами: </Text> Ми можемо поділитися Вашою
            інформацією з нашими діловими партнерами,
            щоб запропонувати Вам
            певні товари, послуги чи акції.
          </Paragraph>
          <Paragraph><Text style={{fontWeight: '600'}}> З іншими користувачами: </Text> коли ви ділитесь особистою
            інформацією або іншим чином взаємодієте у
            загальнодоступних місцях
            з іншими користувачами таку інформацію можуть переглядати всі користувачі та публічно розповсюджувати їх за
            межами.
          </Paragraph>
          <Paragraph><Text style={{fontWeight: '600'}}> З вашої згоди </Text>: Ми можемо розкривати Вашу особисту
            інформацію для будь-яких інших цілейю</Paragraph>

          <Title style={{fontSize: 16}}> Збереження ваших особистих даних</Title>
          <Paragraph> Компанія зберігатиме Ваші персональні дані лише стільки часу, скільки це необхідно для цілей,
            викладених у цій
            Політиці Конфіденційності. Ми будемо зберігати та використовувати Ваші Персональні дані в обсязі,
            необхідному
            для виконання наших
            юридичних зобов’язань (наприклад, якщо ми зобов’язані зберігати ваші дані відповідно до чинного
            законодавства).</Paragraph>
          <Paragraph> Компанія також зберігатиме дані про використання для цілей внутрішнього аналізу. Дані про
            використання зазвичай
            зберігаються для коротший період часу, за винятком випадків, коли ці дані використовуються для посилення
            безпеки або покращення
            функціональності. </Paragraph>
          <Title style={{fontSize: 16}}> Передача ваших особистих даних </Title>
          <Paragraph> Ваша інформація, включаючи персональні дані, обробляється в офісах компанії та в будь -яких інших
            місцях
            де знаходяться сторони, які беруть участь у обробці. Це означає, що ця інформація може бути передана
            на комп'ютерах, що знаходяться за межами Вашого штату, провінції, країни чи іншої урядової юрисдикції, де
            законодавство про захист даних може відрізнятися від законодавства Вашої юрисдикції. </Paragraph>
          <Paragraph> Ваша згода з цією Політикою конфіденційності з подальшим поданням такої інформації є вашою згодою
            на
            це.</Paragraph>
          <Paragraph> Компанія вживе всіх необхідних заходів, щоб забезпечити безпечне та відповідне поводження з Вашими
            даними
            згідно з цією Політикою конфіденційності, передача Ваших персональних даних не відбуватиметься до
            організації
            чи країни
            якщо немає належного контролю, включаючи безпеку Ваших даних та іншої особистої інформації. </Paragraph>
          <Title style={{fontSize: 16}}> Розкриття ваших особистих даних </Title>
          <Title style={{fontSize: 14}}>Ділові операції </Title>
          <Paragraph> Якщо Компанія бере участь у злитті, поглинанні або продажу активів, Ваші Персональні дані можуть
            бути передані. Ми будемо
            надіслати повідомлення до того, як Ваші Персональні дані будуть передані та стануть предметом іншої Політики
            конфіденційності. </Paragraph>
          <Title style={{fontSize: 14}}>Правоохоронні органи </Title>
          <Paragraph> За певних обставин від Компанії може знадобитися розкриття ваших Персональних даних, якщо цього
            вимагає закон
            або у відповідь на дійсні запити державних органів (наприклад, суду чи державного органу). </Paragraph>
          <Title style={{fontSize: 14}}>Інші законодавчі вимоги </Title>
          <Paragraph> Компанія може добросовісно розкрити Ваші Персональні дані, що такі дії необхідні для: </Paragraph>

          <Paragraph> Виконувати юридичні зобов’язання </Paragraph>
          <Paragraph> Захищати та захищати права чи майно Компанії </Paragraph>
          <Paragraph> Запобігайте або розслідувати можливі правопорушення, пов'язані з Додатком</Paragraph>
          <Paragraph> Захищати особисту безпеку Користувачів Послуги</Paragraph>

          <Title style={{fontSize: 16}}> Безпека ваших особистих даних </Title>
          <Paragraph> Для нас важлива безпека ваших персональних даних, але пам’ятайте, що жоден спосіб передачі через
            Інтернет,
            або спосіб електронного зберігання не є 100% безпечним.</Paragraph>
          <Title> Посилання на інші веб-сайти </Title>
          <Paragraph> Наш Сервіс може містити посилання на інші веб-сайти, якими ми не керуємо. Якщо Ви натискаєте
            посилання третьої сторони, Ви
            буде перенаправлено на веб-сайт цієї третьої сторони. Ми наполегливо радимо Вам переглянути Політику
            конфіденційності кожного Вашого сайту
            відвідування. </Paragraph>
          <Paragraph> Ми не контролюємо і не несемо відповідальності за зміст, політику конфіденційності чи практику
            будь-якої третьої особи
            вечірки або послуги. </Paragraph>
          <Title> Зміни до цієї Політики конфіденційності </Title>
          <Paragraph> Ми можемо час від часу оновлювати нашу Політику конфіденційності. Ми повідомимо Вас про будь-які
            зміни, опублікувавши нову Політику Конфіденційности на цій сторінці. </Paragraph>
          <Paragraph> Ми повідомимо Вас електронною поштою та/або помітним повідомленням про наш Додаток до того, як
            зміна
            набуде чинності та
            оновлення. Дата останнього оновлення у верхній частині цієї Політики конфіденційності. </Paragraph>
          <Paragraph> Радимо періодично переглядати цю Політику конфіденційності на предмет будь-яких змін. Зміни в цій
            Політиці конфіденційності
            набувають чинності, коли вони розміщені на цій сторінці. </Paragraph>
          <Title> Зв’яжіться з нами </Title>
          <Paragraph> Якщо у вас є запитання щодо цієї Політики конфіденційності, ви можете зв'язатися з
            нами: </Paragraph>

          <Paragraph> На електронну адресу: auditorium.knmau@gmail.com </Paragraph>
          <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between'}}>
            <Button
              mode='contained'
              onPress={() => {
                hideDialog();
                setCheckAgreement(false);
              }}
              style={{height: 40, width: '48%', alignItems: 'center', justifyContent: 'center'}}
              color={Colors.red}
            >
              <Text style={{fontSize: 10}}>Відхилити</Text>
            </Button>
            <Button
              mode='contained'
              onPress={() => {
                hideDialog();
                setCheckAgreement(true);
              }}
              style={{height: 40, width: '48%', alignItems: 'center', justifyContent: 'center'}}
            >
              <Text style={{fontSize: 10}}>Прийняти</Text>
            </Button>
          </View>
        </ScrollView>
      </Dialog.Content>
    </Dialog>
  </Portal>
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    overflow: 'scroll',
    top: 24,
    bottom: 24
  }
})