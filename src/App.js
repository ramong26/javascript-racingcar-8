import { Console } from "@woowacourse/mission-utils";
import { MissionUtils } from '@woowacourse/mission-utils';

class App {
  async run() {
    // 자동차 이름 입력 및 유효성 검사 로직
    const carInput = await Console.readLineAsync('경주할 자동차 이름을 입력하세요.\n');

    if(!carInput){
      throw new Error('[ERROR] 자동차 이름을 입력하지 않았습니다.')
    }

    const carList = carInput.split(',').map(name => name.trim());
    const uniqueNames = new Set(carList);
    
    // 이름 중복 및 빈 이름 체크
    if(uniqueNames.size !== carList.length){
      throw new Error('[ERROR] 자동차 이름은 중복될 수 없습니다.')
    }
    if(carList.some(name => name.length === 0)){
      throw new Error('[ERROR] 자동차 이름은 비어있을 수 없습니다.')
    }

    // 시도 횟수 입력 및 유효성 검사 로직
    const tryAttempt = await Console.readLineAsync('시도할 횟수는 몇 회인가요? \n')

    if(!tryAttempt){
      throw new Error('[ERROR] 시도할 횟수를 입력하지 않았습니다.')
    }

   // 자동차 경주 게임 로직
    let carPositions = new Array(carList.length).fill(0);

    Console.print('실행 결과');

    for(let i = 1; i<=tryAttempt; i++){
      for(let j = 0; j<carList.length; j++){
        let randomNumber = MissionUtils.Random.pickNumberInRange(0, 9);
       
        if(randomNumber >= 4) carPositions[j]++;
        
        let moveDisplay = '-'.repeat(carPositions[j])
        Console.print(`${carList[j]} : ${moveDisplay}`)
      }
      Console.print('');
    }

    // 최종 우승자 안내 문구 출력 로직
    const carScore = carList.map((name, index) => ({
      name: name,
      position: carPositions[index]
    }));

    const maxPosition = Math.max(...carPositions);
    const winners = carScore.filter(car => car.position === maxPosition);
    const winnerNames = winners.map(winner => winner.name);
    
    Console.print(`최종 우승자 : ${winnerNames.join(', ')}`);
  }
}

export default App;

