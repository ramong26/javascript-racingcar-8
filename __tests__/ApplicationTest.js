import App from '../src/App.js';
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange=jest.fn();

  numbers.reduce((acc,number)=>{
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickNumberInRange)
};

const getLogSpy=()=>{
  const logSpy = jest.spyOn(MissionUtils.Console,'print');
  logSpy.mockClear();
  return logSpy;
}

describe('자동차 경주',()=>{
  test('기능 테스트', async()=>{
    const inputs=['pobi,woni','1'];
    mockQuestions(inputs);
    mockRandoms([3,4]);

    const logSpy=getLogSpy();
    const outputs = ["실행 결과", "pobi : ", "woni : -", "최종 우승자 : woni"];

    const app = new App();
    await app.run();

    outputs.forEach((output)=>{
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output))
    })
  })

  test('자동차 이동 조건 테스트', async () => {
    const inputs = ["pobi", "3"];
    mockQuestions(inputs);
    mockRandoms([4, 3, 5]); 
        
    const logSpy = getLogSpy();
    const app = new App();
    await app.run();
        
    expect(logSpy).toHaveBeenCalledWith("pobi : -");
    expect(logSpy).toHaveBeenCalledWith("pobi : -");
    expect(logSpy).toHaveBeenCalledWith("pobi : --");
  });

  test('공동 우승자 테스트', async()=>{
    const inputs = ["pobi,woni,jun", "1"];
    mockQuestions(inputs);
    mockRandoms([4, 4, 3]);

    const logSpy=getLogSpy();
    const app = new App();
    await app.run();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("최종 우승자 : pobi, woni"));
  });

  test('자동차 이름 중복 예외 테스트', async()=>{
    const inputs = ["pobi,pobi"];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR] 자동차 이름은 중복될 수 없습니다.");
  });

  test('자동차 이름 비어있을 경우 테스트', async()=>{
    const inputs = ["pobi,"];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR] 자동차 이름은 비어있을 수 없습니다.");
  });

  test('자동차 이름 입력하지 않을 경우 테스트', async()=>{
    const inputs = [""];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR] 자동차 이름을 입력하지 않았습니다.");
  });

  test('시도 횟수를 입력하지 않을 경우 테스트', async()=>{
    const inputs = ["pobi,woni", ""];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR] 시도할 횟수를 입력하지 않았습니다.");
  });
})