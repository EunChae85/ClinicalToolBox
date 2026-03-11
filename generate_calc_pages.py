import os
import json

base_dir = "/Users/jo-eun-ae/cratoolkit"
locale_dir = os.path.join(base_dir, "src/app/[locale]")
calculators_dir = os.path.join(locale_dir, "calculators")
ko_json_path = os.path.join(base_dir, "messages/ko.json")
en_json_path = os.path.join(base_dir, "messages/en.json")

with open(ko_json_path, 'r', encoding='utf-8') as f:
    ko_data = json.load(f)
with open(en_json_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Define calculation logic and UI fields
calcs = {
    "visit-window": {
        "inputs": [{"id": "target", "label": "목표 방문일(Target Day)", "type": "number"}, {"id": "margin", "label": "허용 오차(Margin ±Days)", "type": "number"}],
        "calc_logic": "if (target && margin) { setResult(`방문 범위: Target - ${margin}일 ~ Target + ${margin}일`); }",
        "description_ko": "임상시험 방문 일정은 프로토콜에 정의된 방문 시점과 방문 허용 기간을 기준으로 계획됩니다. 이 도구는 목표 방문일(Target Day)과 방문 윈도우를 입력하면 실제 방문 가능한 날짜 범위를 자동으로 계산합니다. CRA와 연구자가 임상시험 일정 관리에 활용할 수 있습니다.",
        "description_en": "Clinical trial visit schedules are planned based on protocol-defined visit points and window margins. Enter the target day and window to automatically calculate the acceptable visit date range.",
        "faqs": [
            {"q_ko": "임상시험 방문 윈도우란 무엇인가요?", "a_ko": "프로토콜에서 정한 목표 방문일 전후로 방문이 허용되는 여유 기간입니다.", "q_en": "What is a visit window?", "a_en": "The acceptable margin of days around a target visit day defined by the protocol."},
            {"q_ko": "Visit window는 어떻게 계산하나요?", "a_ko": "목표일(Target Day)을 기준으로 ±오차일수(Margin)를 더하고 빼서 계산합니다.", "q_en": "How is it calculated?", "a_en": "By adding and subtracting the margin days from the target date."},
            {"q_ko": "Visit schedule 작성 방법은?", "a_ko": "첫 방문(Visit 1)을 기준으로 각 타겟 오프셋을 더하고, 윈도우를 적용하여 전체 표를 만듭니다.", "q_en": "How to create a schedule?", "a_en": "Set Visit 1 as Day 0, add offsets for subsequent visits, and apply the window margin."}
        ]
    },
    "bmi": {
        "inputs": [{"id": "weight", "label": "체중 (kg)", "type": "number"}, {"id": "height", "label": "신장 (cm)", "type": "number"}],
        "calc_logic": "if (weight && height) { const h = height/100; const bmi = weight / (h*h); setResult(`BMI: ${bmi.toFixed(2)} kg/m²`); }",
        "description_ko": "체질량지수(BMI)는 체중과 신장을 이용하여 비만도를 측정하는 지표입니다. 임상시험에서 피험자의 등록 적합성을 평가하거나 용량 조절의 기준으로 널리 사용됩니다.",
        "description_en": "Body Mass Index (BMI) evaluates body weight relative to height. It is widely used in clinical trials for eligibility criteria and dosing.",
        "faqs": [
            {"q_ko": "BMI 공식은 어떻게 되나요?", "a_ko": "체중(kg)을 신장(m)의 제곱으로 나눈 값입니다.", "q_en": "What is the BMI formula?", "a_en": "Weight in kg divided by height in meters squared."}
        ]
    },
    "bsa": {
        "inputs": [{"id": "weight", "label": "체중 (kg)", "type": "number"}, {"id": "height", "label": "신장 (cm)", "type": "number"}],
        "calc_logic": "if (weight && height) { const bsa = Math.sqrt((height * weight) / 3600); setResult(`BSA (Mosteller): ${bsa.toFixed(3)} m²`); }",
        "description_ko": "체표면적(BSA)은 인체의 외부 표면적을 추정하는 값입니다. 항암제 등 정밀한 용량 계산이 필요한 약물 투여 시 주로 활용됩니다.",
        "description_en": "Body Surface Area (BSA) estimates total surface area. It's often used for dosing narrow-therapeutic-index drugs like chemotherapeutics.",
        "faqs": [
            {"q_ko": "Mosteller 공식이란 무엇인가요?", "a_ko": "가장 널리 쓰이는 BSA 계산식으로, √(신장(cm)×체중(kg)/3600) 입니다.", "q_en": "What is the Mosteller formula?", "a_en": "The most common BSA formula: √(height(cm) × weight(kg) / 3600)."}
        ]
    },
    "creatinine-clearance": {
        "inputs": [{"id": "age", "label": "나이 (세)", "type": "number"}, {"id": "weight", "label": "체중 (kg)", "type": "number"}, {"id": "scr", "label": "혈청 크레아티닌 (mg/dL)", "type": "number"}],
        "calc_logic": "if (age && weight && scr) { const crcl = ((140 - age) * weight) / (72 * scr); setResult(`CrCl (Male): ${crcl.toFixed(2)} mL/min | CrCl (Female): ${(crcl*0.85).toFixed(2)} mL/min`); }",
        "description_ko": "크레아티닌 청소율(CrCl)은 신장의 기능을 평가하는 주요 지표입니다. 약물의 신장 배설 정도를 파악하여 용량 조절 및 피험자 적격성 판단에 사용됩니다.",
        "description_en": "Creatinine Clearance estimates renal function. It is critical for adjusting doses of renally excreted drugs and assessing subject eligibility.",
        "faqs": [
            {"q_ko": "Cockcroft-Gault 공식을 사용하나요?", "a_ko": "네, 임상에서 약물 용량 조절 시 가장 흔히 사용하는 Cockcroft-Gault 식을 기본으로 합니다.", "q_en": "Does it use Cockcroft-Gault?", "a_en": "Yes, it uses the standard Cockcroft-Gault equation."}
        ]
    },
    "dose": {
        "inputs": [{"id": "weight", "label": "체중 (kg)", "type": "number"}, {"id": "dose_mg_kg", "label": "투여량 (mg/kg)", "type": "number"}],
        "calc_logic": "if (weight && dose_mg_kg) { setResult(`총 투여 용량: ${(weight * dose_mg_kg).toFixed(2)} mg`); }",
        "description_ko": "환자의 체중을 기준으로 투여해야 할 약물의 정확한 용량을 계산합니다. 용량 오류 방지는 환자 안전과 직결되므로 임상에서 교차 확인용으로 사용됩니다.",
        "description_en": "Calculates the exact drug dose based on patient body weight. Double-checking doses is critical for patient safety and compliance.",
        "faqs": [
            {"q_ko": "단위 변환이 필요한 경우 어떻게 하나요?", "a_ko": "의료 계산기 카테고리의 단위 변환기를 사용하여 lb를 kg으로 먼저 변환해주세요.", "q_en": "What if my weight is in lbs?", "a_en": "Use the Unit Converter tool first to convert it to kg."}
        ]
    },
    "egfr": {
         "inputs": [{"id": "age", "label": "나이 (세)", "type": "number"}, {"id": "scr", "label": "혈청 크레아티닌 (mg/dL)", "type": "number"}],
         "calc_logic": "if (age && scr) { setResult('CKD-EPI 공식 기반 상세 계산은 시스템 코드를 참고해주세요.'); }",
         "description_ko": "eGFR(추정 사구체여과율)은 체표면적으로 정규화된 신장 기능 지표입니다. 최신 CKD-EPI 가이드라인을 기반으로 계산합니다.",
         "description_en": "Estimated Glomerular Filtration Rate (eGFR) evaluates kidney status, typically using the CKD-EPI 2021 race-free equation.",
         "faqs": [
             {"q_ko": "어떤 공식을 적용했나요?", "a_ko": "인종 계수를 제외한 최신 2021 CKD-EPI 공식을 기반으로 합니다.", "q_en": "Which formula is used?", "a_en": "The 2021 CKD-EPI equation without the race multiplier."}
         ]
    },
    "infusion-rate": {
         "inputs": [{"id": "volume", "label": "총 주입 부피 (mL)", "type": "number"}, {"id": "time_min", "label": "주입 시간 (분)", "type": "number"}, {"id": "drop_factor", "label": "수액세트 점적수 (gtt/mL)", "type": "number"}],
         "calc_logic": "if (volume && time_min && drop_factor) { const rate_ml_hr = (volume / (time_min/60)); const gtt_min = (volume * drop_factor) / time_min; setResult(`속도: ${rate_ml_hr.toFixed(1)} mL/hr | 점적수: ${gtt_min.toFixed(1)} gtt/min`); }",
         "description_ko": "정맥 주사(IV) 투여 시 요구되는 주입 속도(mL/hr)와 점적수(gtt/min)를 계산하여 투약 오류를 방지하고 정확한 투여를 돕습니다.",
         "description_en": "Calculates exact IV infusion rates (mL/hr) and drip rates (gtt/min) to prevent dosing errors.",
         "faqs": [
             {"q_ko": "수액세트 점적수(Drop Factor)는 어디서 확인하나요?", "a_ko": "사용하는 IV 세트 포장지에 표기되어 있으며, 보통 성인은 15 또는 20 gtt/mL를 사용합니다.", "q_en": "Where to find the drop factor?", "a_en": "It is printed on the IV tubing package (typically 15 or 20 gtt/mL)."}
         ]
    },
    "enrollment-rate": {
         "inputs": [{"id": "total_pts", "label": "총 목표 등록수", "type": "number"}, {"id": "months_passed", "label": "진행된 기간 (월)", "type": "number"}, {"id": "enrolled", "label": "현재 등록된 피험자 수", "type": "number"}],
         "calc_logic": "if (total_pts && months_passed && enrolled) { const rate = enrolled / months_passed; const remaining = total_pts - enrolled; const remaining_months = remaining / rate; setResult(`월별 등록 속도: ${rate.toFixed(1)} 명/월 | 예상 잔여 기간: ${remaining_months.toFixed(1)} 월`); }",
         "description_ko": "현재까지의 환자 등록 속도를 기반으로 전체 임상시험의 등록이 완료될 예상 시점을 예측합니다. 효과적인 대상자 모집 계획 수립에 필수적입니다.",
         "description_en": "Estimates when the clinical trial enrollment phase will complete based on the current accrual velocity.",
         "faqs": [
              {"q_ko": "잔여 기간은 어떻게 계산되나요?", "a_ko": "현재 달성된 평균 등록 속도가 앞으로도 동일하게 유지된다고 가정하여 남은 목표 수를 속도로 나눕니다.", "q_en": "How is remaining time calculated?", "a_en": "By assuming the current average enrollment rate will remain constant for the rest of the trial."}
         ]
    },
    "study-duration": {
        "inputs": [{"id": "enroll_months", "label": "예상 모집 기간 (월)", "type": "number"}, {"id": "follow_up", "label": "인당 추적관찰 기간 (월)", "type": "number"}],
        "calc_logic": "if (enroll_months && follow_up) { setResult(`예상 LPLV(Last Patient Last Visit)까지 소요 기간: ${enroll_months + follow_up} 월`); }",
        "description_ko": "환자 모집이 완료된 후, 마지막 환자의 추적 관찰 기간까지 포함한 총 임상시험 소요 기간(LPLV)을 시뮬레이션 합니다.",
        "description_en": "Simulates the total time from protocol approval to LPLV (Last Patient Last Visit) based on enrollment and follow-up timelines.",
        "faqs": [{"q_ko": "LPLV가 무슨 뜻인가요?", "a_ko": "Last Patient Last Visit의 약자로, 임상시험에서 대상자의 모든 프로토콜 방문이 종료되는 시점을 의미합니다.", "q_en": "What does LPLV stand for?", "a_en": "Last Patient Last Visit."}]
    },
    "dropout-rate": {
        "inputs": [{"id": "target", "label": "분석 필요 피험자 수", "type": "number"}, {"id": "dropout", "label": "예상 중도탈락률 (%)", "type": "number"}],
        "calc_logic": "if (target && dropout) { const enroll = Math.ceil(target / (1 - (dropout/100))); setResult(`최종 스크리닝 통과 필요 인원: ${enroll} 명`); }",
        "description_ko": "통계적 유의성을 검증하기 위해 필요한 최종 피험자 수와 예상 중도탈락률을 고려하여, 애초에 모집해야 할 목표 피험자 수를 산출합니다.",
        "description_en": "Calculates the total required enrollment count by factoring in the expected dropout rate above the statistically determined sample size.",
        "faqs": [{"q_ko": "중도탈락은 어떤 경우인가요?", "a_ko": "동의 철회, 추적 유실(Loss to follow-up), 유해사례로 인한 중단 등이 포함됩니다.", "q_en": "What constitutes a dropout?", "a_en": "Consent withdrawal, loss to follow-up, or discontinuation due to AEs."}]
    },
    "screening-failure": {
        "inputs": [{"id": "screened", "label": "스크리닝된 환자 수", "type": "number"}, {"id": "failed", "label": "스크리닝 실패 수", "type": "number"}],
        "calc_logic": "if (screened && failed) { const rate = (failed/screened)*100; setResult(`스크리닝 실패율: ${rate.toFixed(1)}%`); }",
        "description_ko": "초기 모집 단계에서 선정/제외 기준을 충족하지 못하고 탈락하는 비율을 계산합니다. 이를 통해 등록 전략 및 프로토콜 기준의 적절성을 평가할 수 있습니다.",
        "description_en": "Calculates the percentage of subjects who fail screening. High failure rates may indicate too stringent inclusion/exclusion criteria.",
        "faqs": [{"q_ko": "실패율이 너무 높으면 어떻게 해야 하나요?", "a_ko": "프로토콜의 I/E criteria(선정제외기준)가 현실적인지 검토하고, 기관의 사전 스크리닝(Pre-screening) 절차를 강화해야 합니다.", "q_en": "What to do if rate is too high?", "a_en": "Re-evaluate I/E criteria and fortify pre-screening procedures at sites."}]
    },
    "protocol-deviation": {
         "inputs": [{"id": "total_visits", "label": "전체 완료된 방문 수", "type": "number"}, {"id": "deviations", "label": "프로토콜 위반 발생 건수", "type": "number"}],
         "calc_logic": "if (total_visits && deviations) { const rate = (deviations/total_visits)*100; setResult(`방문당 위반율: ${rate.toFixed(2)}%`); }",
         "description_ko": "수행된 전체 방문 수 대비 발생한 프로토콜 위반 건수의 비율을 산출합니다. 실사(Audit)나 모니터링 방문 시 사이트의 품질 지표(KPI)로 활용됩니다.",
         "description_en": "Calculates the protocol deviation rate as a KPI for site quality and compliance during monitoring.",
         "faqs": [{"q_ko": "어떤 항목들이 위반에 해당하나요?", "a_ko": "방문 윈도우 미준수, 잘못된 약물 투여, 금지 약물 복용 등이 흔한 프로토콜 위반 사례입니다.", "q_en": "What are common PDs?", "a_en": "Out of window visits, incorrect dosing, and taking prohibited meds."}]
    },
    "randomization": {
        "inputs": [{"id": "arms", "label": "배정군 수 (Arms)", "type": "number"}, {"id": "ratio", "label": "비율 (예: 1:1, 2:1 등 분수 형태 생략)", "type": "text"}],
        "calc_logic": "if (arms) { setResult(`단순 난수 생성을 모방: 그룹 ${Math.floor(Math.random()*Number(arms)) + 1} 배정 (시뮬레이션 용도)`); }",
        "description_ko": "단순 시뮬레이션용 난수 기반 무작위 배정 도구입니다. 실제 임상시험에서는 검증된 IWRS/IRT 시스템을 사용해야 합니다.",
        "description_en": "A simple randomization simulation tool. For real clinical trials, always use a validated IWRS/IRT system.",
        "faqs": [{"q_ko": "이 도구를 실제 무작위 배정에 써도 되나요?", "a_ko": "아니요. 본 도구는 교육 및 알고리즘 시뮬레이션용이며, 실제 임상 적용을 위해 밸리데이션 되지 않았습니다.", "q_en": "Can I use this for real trials?", "a_en": "No, this is for educational and simulation purposes only, not validated for production use."}]
    },
    "unit-converter": {
         "inputs": [{"id": "val", "label": "값", "type": "number"}],
         "calc_logic": "if (val) { setResult(`결과: cm->inch(${(val/2.54).toFixed(2)}), kg->lb(${(val*2.20462).toFixed(2)}), C->F(${((val*9/5)+32).toFixed(1)})`); }",
         "description_ko": "의료 및 임상 현장에서 자주 쓰이는 cm ↔ inch, kg ↔ lb, °C ↔ °F 등 주요 단위들을 빠르고 정확하게 변환해주는 도구입니다.",
         "description_en": "Quickly convert essential clinical units including weight, height, and temperature.",
         "faqs": [{"q_ko": "파운드(lb)에서 킬로그램(kg) 변환 공식은?", "a_ko": "1 kg은 약 2.20462 lb입니다. 즉, lb 값을 2.20462로 나누면 kg이 됩니다.", "q_en": "Formula for kg to lbs?", "a_en": "1 kg is approximately 2.20462 lbs."}]
    },
    "sample-size": {
        "inputs": [{"id": "alpha", "label": "유의수준 (Alpha)", "type": "number"}, {"id": "power", "label": "검정력 (Power, %)", "type": "number"}, {"id": "effect", "label": "효과크기", "type": "number"}],
        "calc_logic": "if (alpha && power && effect) { setResult('상세 샘플 사이즈 계산은 통계 패키지나 로직 확장이 필요합니다. 시뮬레이션: N = 100'); }",
        "description_ko": "임상시험의 가설검정에 필요한 최소 표본의 크기를 산출합니다. 1종 오류율과 2종 오류율, 효과 크기를 바탕으로 계산합니다.",
        "description_en": "Calculates the minimum required sample size for clinical trial hypothesis testing.",
        "faqs": [{"q_ko": "보통 유의수준은 얼마를 사용하나요?", "a_ko": "일반적으로 양측 검정 유의수준(Alpha)은 0.05(5%)를 사용합니다.", "q_en": "Common alpha used?", "a_en": "Usually 0.05 (5%) for two-sided tests."}]
    },
    "confidence-interval": {
        "inputs": [{"id": "mean", "label": "표본 평균", "type": "number"}, {"id": "std", "label": "표준 오차(또는 편차)", "type": "number"}, {"id": "n", "label": "표본 수", "type": "number"}],
        "calc_logic": "if (mean && std) { const margin = 1.96 * std; setResult(`95% 신뢰구간: ${(mean-margin).toFixed(2)} ~ ${(mean+margin).toFixed(2)}`); }",
        "description_ko": "모수가 존재할 것으로 신뢰할 수 있는 구간(주로 95% CI)을 표본 평균과 표준 오차 정보를 통해 계산합니다.",
        "description_en": "Calculates the Confidence Interval (typically 95%) based on sample mean and standard error.",
        "faqs": [{"q_ko": "95% 신뢰구간의 의미는 무엇인가요?", "a_ko": "동일한 추출 방법으로 구간을 여러 번 추정했을 때, 95%의 구간이 실제 모수를 포함한다는 의미입니다.", "q_en": "What does 95% CI mean?", "a_en": "If sampling is repeated, 95% of calculated intervals will contain the true population parameter."}]
    },
    "odds-ratio": {
        "inputs": [{"id": "ae", "label": "노출군 중 발생 건수(A)", "type": "number"}, {"id": "be", "label": "노출군 중 미발생 건수(B)", "type": "number"}, {"id": "ce", "label": "비노출군 중 발생 건수(C)", "type": "number"}, {"id": "de", "label": "비노출군 중 미발생 건수(D)", "type": "number"}],
        "calc_logic": "if (ae && be && ce && de) { const or = (ae*de)/(be*ce); setResult(`오즈비 (OR): ${or.toFixed(3)}`); }",
        "description_ko": "환자-대조군 연구 등에서 위험 요인 노출 여부에 따른 질병 발생의 연관성을 파악하는 오즈비(Odds Ratio)를 구합니다.",
        "description_en": "Computes the Odds Ratio (OR) typically used in case-control studies to quantify association.",
        "faqs": [{"q_ko": "오즈비가 1보다 크면 무슨 뜻인가요?", "a_ko": "해당 요인에 노출되었을 때 질환 발생 위험 단위가 커짐을(양의 상관성) 의미합니다.", "q_en": "What does OR > 1 mean?", "a_en": "Exposure is associated with higher odds of outcome."}]
    },
    "hazard-ratio": {
         "inputs": [{"id": "info", "label": "로직 상세 제어 필요", "type": "text"}],
         "calc_logic": "setResult('생존 분석(Survival Analysis)을 위한 카플란 마이어, 콕스 모델 등 전문 통계 시스템 사용을 권장합니다.');",
         "description_ko": "시간에 따른 사건 발생률(위험률)을 비교하는 지표로, 항암제 등의 생존 연장 임상시험에서 주로 사용됩니다.",
         "description_en": "Compares the risk of an event across time between groups, widely used in oncology survival trials.",
         "faqs": [{"q_ko": "위험비(HR)가 1 미만이면 어떤 뜻인가요?", "a_ko": "실험군의 사건(사망, 진행 등) 발생 위험이 대조군보다 낮아 중재 효과가 긍정적임을 뜻합니다.", "q_en": "What does HR < 1 mean?", "a_en": "The event rate is lower in the treatment group, suggesting benefit."}]
    },
    "p-value": {
        "inputs": [{"id": "z", "label": "Z-score 또는 검정 통계량", "type": "number"}],
        "calc_logic": "if (z) { setResult(`단순 정규분포 가정 p-value 검색 시뮬레이션 값입니다.`); }",
        "description_ko": "가설검정에서 귀무가설이 참이라고 가정했을 때, 관찰된 통계량 이상의 극단적 값이 나올 확률입니다.",
        "description_en": "The probability of obtaining test results at least as extreme as the results observed, under the null hypothesis.",
         "faqs": [{"q_ko": "p < 0.05는 무슨 의미인가요?", "a_ko": "결과가 우연히 일어날 확률이 5% 미만임을 나타내어, 보통 이를 통계적으로 유의하다고 해석합니다.", "q_en": "What does p < 0.05 mean?", "a_en": "It generally indicates statistical significance, meaning the probability of results by chance is less than 5%."}]
    }
}

template = """'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AdSlot from '@/components/ads/AdSlot';
import { useState } from 'react';

export default function CalculatorPage() {
    const tTools = useTranslations('Tools');
    const tDesc = useTranslations('CalcDesc');
    const tFAQ = useTranslations('CalcFAQ');
    const [inputs, setInputs] = useState<any>({});
    const [result, setResult] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        {calc_logic}
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('{id}_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('{id}_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-md">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-xl">입력 및 계산</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {input_jsx}
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full md:w-auto h-12 px-8 text-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        계산하기 (Calculate)
                    </Button>

                    {result && (
                        <div className="p-6 bg-blue-50 rounded-xl mt-8 border border-blue-200 shadow-inner">
                            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">결과 (Result)</h3>
                            <p className="text-2xl font-bold text-slate-900">{result}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-amber-500">💡</span> 자주 묻는 질문 (FAQ)
                </h2>
                <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-slate-200 px-4 shadow-sm">
                    {faq_jsx}
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
"""

if "CalcDesc" not in ko_data:
    ko_data["CalcDesc"] = {}
if "CalcFAQ" not in ko_data:
    ko_data["CalcFAQ"] = {}

if "CalcDesc" not in en_data:
    en_data["CalcDesc"] = {}
if "CalcFAQ" not in en_data:
    en_data["CalcFAQ"] = {}

for cid, data in calcs.items():
    ko_data["CalcDesc"][f"{cid}_desc"] = data["description_ko"]
    en_data["CalcDesc"][f"{cid}_desc"] = data["description_en"]
    
    faq_jsx = ""
    for idx, faq in enumerate(data.get("faqs", [])):
        q_key = f"{cid}_faq_q{idx}"
        a_key = f"{cid}_faq_a{idx}"
        
        ko_data["CalcFAQ"][q_key] = faq["q_ko"]
        ko_data["CalcFAQ"][a_key] = faq["a_ko"]
        en_data["CalcFAQ"][q_key] = faq["q_en"]
        en_data["CalcFAQ"][a_key] = faq["a_en"]
        
        faq_jsx += f"""
                    <AccordionItem value="item-{idx}">
                        <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors py-4">
                            {{tFAQ('{q_key}')}}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {{tFAQ('{a_key}')}}
                        </AccordionContent>
                    </AccordionItem>"""
                    
    input_jsx = ""
    calc_logic_vars = []
    for inp in data["inputs"]:
        inp_id = inp["id"]
        inp_type = "number" if inp.get("type") == "number" else "text"
        input_jsx += f"""
                        <div className="space-y-2">
                            <Label className="font-medium text-slate-700">{inp['label']}</Label>
                            <Input 
                                type="{inp_type}" 
                                placeholder="Enter value" 
                                onChange={{(e) => handleInputChange(e, '{inp_id}')}} 
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />
                        </div>"""
        calc_logic_vars.append(f"const {inp_id} = inputs['{inp_id}'];")
        
    calc_logic = "\n        ".join(calc_logic_vars) + "\n        " + data["calc_logic"]
    
    file_content = template.replace("{id}", cid).replace("{input_jsx}", input_jsx).replace("{calc_logic}", calc_logic).replace("{faq_jsx}", faq_jsx)
    
    tool_dir = os.path.join(calculators_dir, cid)
    if not os.path.exists(tool_dir):
        os.makedirs(tool_dir)
        
    with open(os.path.join(tool_dir, "page.tsx"), 'w', encoding='utf-8') as f:
        f.write(file_content)

with open(ko_json_path, 'w', encoding='utf-8') as f:
    json.dump(ko_data, f, ensure_ascii=False, indent=4)
with open(en_json_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=4)
