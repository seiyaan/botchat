<?
header('Content-Type: application/json; charset=utf-8');

// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') {
  echo json_encode(array("success" => false));
  exit;
}

// Ajaxからのアクセスがあれば以下を実行
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if (isset($data["message"]) && $data["message"] !== "") {
  $answer = answer(htmlspecialchars($data["message"]));
  $result = array(
    "success" => true,
    "answer" => $answer
  );
} else {
  $result = array("success" => false);
}
$json = json_encode($result);
echo $json;
exit;

/**
 * 回答集(CSV)から、質問に対する回答を見つけて返却する。
 * @param $question String 質問
 * @return $answer String 回答
*/
function answer($question) {
  //返却するデータを初期化。
  $answer = "";

  if ($fp = fopen("./data.csv", "r")) {
    // 回答集を読み込んで回す。
    while ($row = fgetcsv($fp)) {
      if (preg_match("/" . $row[0] ."/u", $question)) {
        $answer = $row[1];
        break;
      }
    }
  } else {
    // 回答集がうまく読み込めない。
    $answer = "接続エラー！調子が悪くてごめんね！";
  }
  
  if ($answer === "") {
    // 回答が見つからない場合は、とにかく謝る。謝るの大事。
    // 社会人の基本。
    $answer = "ごめんね、わからない！勉強しておきます！";
  }
  
  return $answer;
}
