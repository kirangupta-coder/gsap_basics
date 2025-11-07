import { Fragment, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Dialog, Disclosure, Tab, Transition } from "@headlessui/react";
import ProgressCircle from "../components/ProgressCircle";

import { constants } from "../utils/ranges";

import Chevron from "../assets/icons/Chevron.svg";
import Info from "../assets/icons/Info.svg";
import Caret from "../assets/icons/Caret.svg";
import MMQScore from "@/components/MMQSCore";
import Report from "./Report";
// import { ReactComponent as HbA1cOptimal } from "../assets/icons/HbA1cOptimal.svg";
// import { ReactComponent as HbA1cNonOptimal } from "../assets/icons/HbA1cNonOptimal.svg";

const Range = ({
  ranges = [
    { point: 0, label: "Start", color: "#ccc" },
    { point: 100, label: "End", color: "#000" },
  ],
  selectedIndex,
  className = "",
}) => {
  selectedIndex -= ranges.length - 1 === selectedIndex;
  return (
    <div className={`relative grid grid-flow-col auto-cols-fr ${className}`}>
      {ranges.slice(0, -1).map((rangeItem, index, list) => (
        <div key={`range-${index}`} className="flex flex-col justify-end">
          {index === selectedIndex && (
            <img
              src={Caret}
              className="self-center shrink-0 w-2 h-1"
              style={{ color: ranges[selectedIndex].color }}
            />
          )}
          <h6
            className="opacity-60 text-center text-xxs font-medium uppercase truncate"
            style={
              index === selectedIndex
                ? { color: ranges[selectedIndex].color }
                : {}
            }
          >
            {rangeItem.label}
          </h6>
          <div
            className="my-1 h-1"
            style={{
              backgroundColor:
                index === selectedIndex ? ranges[selectedIndex].color : "#fff",
              borderTopLeftRadius: index === 0 ? 9999 : undefined,
              borderBottomLeftRadius: index === 0 ? 9999 : undefined,
              borderTopRightRadius:
                index === list.length - 1 ? 9999 : undefined,
              borderBottomRightRadius:
                index === list.length - 1 ? 9999 : undefined,
            }}
          />
          <p className="opacity-70 text-xxs">{rangeItem.point}</p>
        </div>
      ))}
      <p className="absolute bottom-0 right-0 opacity-70 text-xxs">
        {ranges[ranges.length - 1].point}
      </p>
    </div>
  );
};

const ListItemContainer = ({
  disabled = false,
  label = "",
  defaultExpanded = false,
  title,
  desc,
  className = "",
  ...props
}) => {
  return (
    <Disclosure
      defaultOpen={defaultExpanded}
      as="div"
      className="px-6 py-4 rounded-2xl border border-secondary bg-primary text-white shadow-box"
    >
      <Disclosure.Button as="div" disabled={disabled}>
        {({ open }) => [
          <div
            key="list-item-container-head"
            className="flex items-start justify-between space-x-1"
          >
            <h2 className="text-xs font-medium">{label}</h2>
            <img
              src={Chevron}
              className={`h-3 w-3 opacity-70 transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>,
          <Fragment key="list-item-container-body">{props.children}</Fragment>,
        ]}
      </Disclosure.Button>
      <Disclosure.Panel>
        {typeof title === "string" && (
          <h5 className="mt-2.5 text-secondary text-xs font-medium">{title}</h5>
        )}
        {typeof desc === "string" && (
          <p className="mt-1.5 text-xxs font-light leading-tight whitespace-pre-line">
            {desc}
          </p>
        )}
      </Disclosure.Panel>
    </Disclosure>
  );
};

const ScanResult = () => {
  const { state } = useLocation();
  const result = state?.result;
  const [modalState, setModalState] = useState({
    visible: false,
    title: "",
    desc: "",
  });
  const closeModal = () =>
    setModalState({ visible: false, title: "", desc: "" });

  return result?.scan_id?.length > 0 ? (
    <section className="px-6 py-2 pb-8 bg-black">
      <Tab.Group>
        <Tab.List className="flex flex-wrap items-center justify-center">
          {[
            // "Health Score",
            "Key Body Vitals",
            "Heart Health",
            " MMQ Score",
            "Physiological",
          ].map((label, index) => (
            <Tab
              key={`tab-header-${index}`}
              className={({ selected }) =>
                `m-1 px-4 py-2 rounded-full ${
                  selected
                    ? "bg-[#364560] text-white"
                    : "bg-secondary text-black"
                } text-xxs font-medium outline-none`
              }
            >
              {label}
            </Tab>
          ))}
          {(result?.metadata?.heart_scores?.stress_index ?? "--") !== "--" && (
            <Tab
              key="tab-header-5"
              className={({ selected }) =>
                `m-1 px-4 py-2 rounded-full ${
                  selected
                    ? "bg-[#364560] text-white"
                    : "bg-secondary text-black"
                } text-xxs font-medium outline-none`
              }
            >
              Stress & ANS
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels className="mt-6 space-y-6">
          <Tab.Panel className="space-y-6">
            {[
              { label: "Heart Rate", value: result?.vitals.heart_rate },
              { label: "Respiration Rate", value: result?.vitals.resp_rate },
              {
                label: "Oxygen Saturation",
                value: result?.vitals.oxy_sat_prcnt,
              },
            ].map((item, index) => {
              const ranges =
                item.label === "Heart Rate"
                  ? constants[item.label].ranges[result?.posture ?? "resting"]
                  : constants[item.label].ranges;
              const selectedRangeIndex = ranges.reduce(
                (p, c, ci) => (item.value >= c.point ? ci : p),
                0
              );
              return (
                <ListItemContainer
                  key={`section-item-${index}`}
                  label={item.label}
                  title={`Your ${item.label} is ${ranges[selectedRangeIndex].label}`}
                  desc={
                    constants[item.label].info +
                    "\n\n" +
                    ranges[selectedRangeIndex].desc
                  }
                >
                  <div className="py-3 flex items-center justify-between space-x-2">
                    <div className="shrink-0 basis-1/4 text-center font-semibold">
                      <h4 className="text-secondary text-xl">{item.value}</h4>
                      <h5 className="opacity-70 text-xxs">
                        {constants[item.label].unit}
                      </h5>
                    </div>
                    <Range
                      className="grow"
                      ranges={ranges}
                      selectedIndex={selectedRangeIndex}
                    />
                  </div>
                </ListItemContainer>
              );
            })}
            {(() => {
              const sys = result?.vitals.bp_sys;
              const dia = result?.vitals.bp_dia;
              const selectedSYSRangeIndex =
                sys !== "--"
                  ? constants["Blood Pressure"].ranges[0].reduce(
                      (p, c, ci) => (sys > c.point ? ci : p),
                      0
                    )
                  : undefined;
              const selectedDIARangeIndex =
                dia !== "--"
                  ? constants["Blood Pressure"].ranges[1].reduce(
                      (p, c, ci) => (dia > c.point ? ci : p),
                      0
                    )
                  : undefined;
              return (
                <ListItemContainer
                  key="section-item-3"
                  label="Blood Pressure"
                  title={`Your Blood Pressure is ${constants["Blood Pressure"].ranges[0][selectedSYSRangeIndex]?.label}`}
                  desc={
                    constants["Blood Pressure"].info +
                    "\n\n" +
                    constants["Blood Pressure"].ranges[0][selectedSYSRangeIndex]
                      ?.desc
                  }
                  disabled={
                    selectedSYSRangeIndex === undefined ||
                    selectedDIARangeIndex === undefined
                  }
                >
                  <div className="py-3 flex items-center justify-between space-x-2">
                    <div className="shrink-0 basis-1/4 text-center">
                      <div className="font-semibold">
                        <h4 className="inline text-secondary text-xl">{sys}</h4>
                        &nbsp;
                        <h5 className="inline opacity-70 text-xxs">
                          {constants["Blood Pressure"].unit}
                        </h5>
                      </div>
                      <p className="text-ternary text-xxs font-medium">
                        Systolic
                      </p>
                    </div>
                    <Range
                      className="grow"
                      ranges={constants["Blood Pressure"].ranges[0]}
                      selectedIndex={selectedSYSRangeIndex}
                    />
                  </div>
                  <div className="py-3 flex items-center justify-between space-x-2">
                    <div className="shrink-0 basis-1/4 text-center">
                      <div className="font-semibold">
                        <h4 className="inline text-secondary text-xl">{dia}</h4>
                        &nbsp;
                        <h5 className="inline opacity-70 text-xxs">
                          {constants["Blood Pressure"].unit}
                        </h5>
                      </div>
                      <p className="text-ternary text-xxs font-medium">
                        Diastolic
                      </p>
                    </div>
                    <Range
                      className="grow"
                      ranges={constants["Blood Pressure"].ranges[1]}
                      selectedIndex={selectedDIARangeIndex}
                    />
                  </div>
                </ListItemContainer>
              );
            })()}
          </Tab.Panel>
          <Tab.Panel className="space-y-6">
            {[
              {
                label: "SDNN",
                value:
                  result?.metadata.heart_scores.sdnn !== "--"
                    ? Math.round(result?.metadata.heart_scores.sdnn)
                    : "--",
              },
              {
                label: "RMSSD",
                value:
                  result?.metadata.heart_scores.rmssd !== "--"
                    ? Math.round(result?.metadata.heart_scores.rmssd)
                    : "--",
              },
              {
                label: "PNN50",
                value: result?.metadata.heart_scores.pNN50_per,
              },
              {
                label: "Cardiac Output",
                value: result?.metadata.cardiovascular.cardiac_out,
              },
              {
                label: "Mean Arterial Pressure",
                value: result?.metadata.cardiovascular.map,
              },
              {
                label: "Heart Utilized",
                value: result?.metadata.heart_scores.heart_utilized,
              },
            ].map((item, index) => {
              const selectedRangeIndex =
                item.value !== "--"
                  ? constants[item.label].ranges.reduce(
                      (p, c, ci) => (item.value >= c.point ? ci : p),
                      0
                    )
                  : undefined;
              return (
                <ListItemContainer
                  key={`section-item-${index}`}
                  label={item.label}
                  title={`Your ${item.label} is ${
                    constants[item.label].ranges[selectedRangeIndex]?.label
                  }`}
                  desc={
                    constants[item.label].info +
                    "\n\n" +
                    constants[item.label].ranges[selectedRangeIndex]?.desc
                  }
                  disabled={selectedRangeIndex === undefined}
                >
                  <div className="py-3 flex items-center justify-between space-x-2">
                    <div className="shrink-0 basis-1/4 text-center font-semibold">
                      <h4 className="text-secondary text-xl">{item.value}</h4>
                      <h5 className="opacity-70 text-xxs">
                        {constants[item.label].unit}
                      </h5>
                    </div>
                    <Range
                      className="grow"
                      ranges={constants[item.label].ranges}
                      selectedIndex={selectedRangeIndex}
                    />
                  </div>
                </ListItemContainer>
              );
            })}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Heart Rate Max",
                  value: result?.metadata.heart_scores.HRMax,
                  gradient: "from-[#2055F3] to-[#0A39C3]/0",
                },
                {
                  label: "Heart Rate Reserve",
                  value: result?.metadata.heart_scores.HRR,
                  gradient: "from-[#2055F3] to-[#0A39C3]/0",
                },
                {
                  label: "Target HR Range",
                  value: result?.metadata.heart_scores.THRR,
                  gradient: "from-[#389CF9] to-[#628AFE]/0",
                },
                {
                  label: "VO₂ Max",
                  value: result?.metadata.physiological_scores.vo2max,
                  gradient: "from-[#389CF9] to-[#628AFE]/0",
                },
              ].map((item, index) => (
                <button
                  type="button"
                  key={`section-smallitem-${index}`}
                  className={`px-3 py-4 rounded-2xl bg-gradient-to-b ${item.gradient} flex flex-col items-stretch justify-between text-left`}
                  onClick={() =>
                    setModalState({
                      visible: true,
                      title: item.label,
                      desc: constants[item.label].description,
                    })
                  }
                >
                  <div className="flex items-start justify-between space-x-1">
                    <h2 className="text-xs font-medium">{item.label}</h2>
                    <Info className="my-0.5 h-3 w-3 opacity-70" />
                  </div>
                  <div className="mt-3 break-all font-semibold">
                    <h4 className="inline text-secondary text-xl">
                      {item.value}
                    </h4>
                    &nbsp;
                    <h5 className="inline opacity-70 text-xxs">
                      {constants[item.label].unit}
                    </h5>
                  </div>
                </button>
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="space-y-6">
            <Report />
          </Tab.Panel>
          <Tab.Panel className="space-y-6">
            {(() => {
              const bmi = result?.metadata.physiological_scores.bmi;
              const selectedBMIRangeIndex = constants.BMI.ranges.reduce(
                (p, c, ci) => (bmi > c.point ? ci : p),
                0
              );
              return (
                <ListItemContainer
                  label="BMI"
                  title={`Your BMI is ${constants.BMI.ranges[selectedBMIRangeIndex].label}`}
                  desc={
                    constants.BMI.info +
                    "\n\n" +
                    constants.BMI.ranges[selectedBMIRangeIndex].desc
                  }
                >
                  <div className="py-3 flex items-center justify-between space-x-2">
                    <div className="shrink-0 basis-1/4 text-center font-semibold">
                      <h4 className="text-secondary text-xl">{bmi}</h4>
                      <h5 className="opacity-70 text-xxs">
                        {constants.BMI.unit}
                      </h5>
                    </div>
                    <Range
                      className="grow"
                      ranges={constants.BMI.ranges}
                      selectedIndex={selectedBMIRangeIndex}
                    />
                  </div>
                </ListItemContainer>
              );
            })()}
            <div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Blood Volume",
                    value: result?.metadata.physiological_scores.bloodvolume,
                    gradient: "from-[#2055F3] to-[#0A39C3]/0",
                  },
                  {
                    label: "Total Body Water",
                    value: result?.metadata.physiological_scores.tbw,
                    gradient: "from-[#2055F3] to-[#0A39C3]/0",
                  },
                  ...(result?.metadata.physiological_scores.cal_carb !== "--" &&
                  result?.metadata.physiological_scores.cal_fat !== "--"
                    ? [
                        {
                          label: "Calorie from Carb",
                          value:
                            !(
                              result?.metadata.physiological_scores.cal_carb >=
                              0
                            ) ||
                            !(
                              result?.metadata.physiological_scores.cal_carb <=
                              100
                            )
                              ? "--"
                              : result.metadata.physiological_scores.cal_carb,
                          gradient: "from-[#543C9A] to-[#2E2D6E]/0",
                        },
                        {
                          label: "Calorie from Fat",
                          value:
                            !(
                              result?.metadata.physiological_scores.cal_fat >= 0
                            ) ||
                            !(
                              result?.metadata.physiological_scores.cal_fat <=
                              100
                            )
                              ? "--"
                              : result.metadata.physiological_scores.cal_fat,
                          gradient: "from-[#543C9A] to-[#2E2D6E]/0",
                        },
                      ]
                    : []),
                ].map((item, index) => (
                  <button
                    type="button"
                    key={`section-smallitem-${index}`}
                    className={`px-3 py-4 rounded-2xl bg-gradient-to-b ${item.gradient} flex flex-col items-stretch justify-between text-left`}
                    onClick={() =>
                      setModalState({
                        visible: true,
                        title: item.label,
                        desc: constants[item.label].description,
                      })
                    }
                  >
                    <div className="flex items-start justify-between space-x-1">
                      <h2 className="text-xs font-medium">{item.label}</h2>
                      <Info className="my-0.5 h-3 w-3 opacity-70" />
                    </div>
                    <div className="mt-3 break-all font-semibold">
                      <h4 className="inline text-secondary text-xl">
                        {item.value}
                      </h4>
                      &nbsp;
                      <h5 className="inline opacity-70 text-xxs">
                        {constants[item.label].unit}
                      </h5>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Body Water %",
                    value: result?.metadata.physiological_scores.tbwp,
                  },
                  {
                    label: "Total Body Fat",
                    value: result?.metadata.physiological_scores.bodyfat,
                  },
                  {
                    label: "Body Weight",
                    value: result?.metadata.physiological_scores.weight,
                  },
                ].map((item, index) => (
                  <button
                    type="button"
                    key={`section-smallitem-${index}`}
                    className="px-3 py-4 rounded-2xl bg-gradient-to-b from-[#389CF9] to-[#628AFE]/0 flex flex-col items-stretch justify-between text-left"
                    onClick={() =>
                      setModalState({
                        visible: true,
                        title: item.label,
                        desc: constants[item.label].description,
                      })
                    }
                  >
                    <div className="flex items-start justify-between space-x-1">
                      <h2 className="text-xs font-medium">{item.label}</h2>
                      <Info className="my-0.5 h-3 w-3 opacity-70" />
                    </div>
                    <div className="mt-3 break-all font-semibold">
                      <h4 className="inline text-secondary text-xl">
                        {item.value}
                      </h4>
                      &nbsp;
                      <h5 className="inline opacity-70 text-xxs">
                        {constants[item.label].unit}
                      </h5>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Tab.Panel>
          {(result?.metadata?.heart_scores?.stress_index ?? "--") !== "--" && (
            <Tab.Panel className="space-y-6">
              {(() => {
                const stressLevel = result?.metadata.heart_scores.stress_index;
                const selectedRange = constants["Stress Level"].ranges.reduce(
                  (p, c) => (stressLevel > c.point ? c : p)
                );
                let detailTitle = "";
                let detailDescription = "";
                if ((result?.metadata?.heart_scores?.rmssd ?? "--") !== "--") {
                  if (result.metadata.heart_scores.rmssd < 65) {
                    if (
                      result.vitals.heart_rate > 100 ||
                      result.vitals.bp_sys > 130 ||
                      result.vitals.bp_dia > 90
                    ) {
                      detailTitle = "More Sympathetic Interactions";
                      detailDescription =
                        "Although HRV manifests as a function of your heart rate, it actually originates from your nervous system. Your autonomic nervous system, which controls the involuntary aspects of your physiology, has two branches, parasympathetic (deactivating) and sympathetic (activating).\n\nThe sympathetic nervous system (often called “fight or flight”) reflects responses to things like stress and exercise, and increases your heart rate and blood pressure.";
                    } else {
                      detailTitle = "More Parasympathetic Interactions";
                      detailDescription =
                        "Although HRV manifests as a function of your heart rate, it actually originates from your nervous system. Your autonomic nervous system, which controls the involuntary aspects of your physiology, has two branches, parasympathetic (deactivating) and sympathetic (activating)\n\nThe parasympathetic nervous system (often referred to as “rest and digest”) handles inputs from internal organs, like digestion or your fingernails and hair growing.";
                    }
                  } else {
                    detailTitle = "Balanced ANS Interactions";
                    detailDescription =
                      "When you have high heart rate variability, it means that your body is responsive to both sets of inputs (parasympathetic and sympathetic). This is a sign that your nervous system is balanced, and that your body is very capable of adapting to its environment and performing at its best.";
                  }
                } else {
                  detailDescription =
                    "Not enought data to process. This happens when the signal strength of the scan is poor due to improper light or too much movements.";
                }
                return (
                  <>
                    <div className="px-6 py-4 rounded-2xl border border-secondary bg-primary text-white shadow-box">
                      <div className="flex items-center justify-between space-x-4">
                        <img
                          src={`${selectedRange.icon}`}
                          alt=""
                          height={40}
                          width={40}
                        />
                        <div className="grow">
                          <h2 className="text-xs font-medium">Stress Level</h2>
                          <h4
                            className="mt-1 text-xxs font-medium uppercase"
                            style={{ color: selectedRange.color }}
                          >
                            {selectedRange.label}
                          </h4>
                        </div>
                        <div className="shrink-0 text-right font-semibold">
                          <h4 className="text-secondary text-xl">
                            {stressLevel}
                          </h4>
                          <h5 className="opacity-70 text-xxs">
                            {constants["Stress Level"].unit}
                          </h5>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-secondary text-xs font-medium">
                          Your Stress Level is {selectedRange.label}
                        </h5>
                        <p className="mt-1.5 text-xxs font-light leading-tight whitespace-pre-line text-white">
                          {constants["Stress Level"].description}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 rounded-xl bg-ternary/20 space-y-1.5 text-white">
                      {detailTitle.length > 0 && (
                        <h3 className="text-xs font-medium">{detailTitle}</h3>
                      )}
                      <p className="text-xxs font-light leading-tight whitespace-pre-line text-white">
                        {detailDescription}
                      </p>
                      <h5 className="text-xs text-center font-medium text-white">
                        Autonomic Nervous Systems (ANS)
                      </h5>
                    </div>
                  </>
                );
              })()}
            </Tab.Panel>
          )}
          <div className="p-6 rounded-2xl flex flex-col items-center text-center bg-[#364560] text-white">
            <h4 className="text-xs font-medium">Disclaimer</h4>
            <p className="mt-2 text-xxs text-justify">
              For Investigational Use Only. CarePlix is not a substitute for the
              clinical judgment of a healthcare professional. CarePlix is
              intended to improve your awareness of general wellness. CarePlix
              does not diagnose, treat, mitigate or prevent any disease,
              symptom, disorder or abnormal physical state. Consult with a
              healthcare professional or emergency services if you believe you
              may have a medical issue.
            </p>
            <Link
              className="mt-4 px-4 py-2 rounded-full bg-white text-primary text-xs font-medium"
              to="/"
              replace
            >
              Scan Again
            </Link>
          </div>
        </Tab.Panels>
      </Tab.Group>
      <Transition show={modalState.visible} as={Fragment}>
        <Dialog as={Fragment} onClose={closeModal}>
          <Transition.Child
            className="fixed top-0 bottom-0 left-0 right-0 bg-black/70 flex items-center justify-center"
            enter="duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-300 delay-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Transition.Child
              as={Fragment}
              enter="delay-150 duration-200"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="duration-100"
              leaveFrom="opacity-50 scale-50"
              leaveTo="opacity-0 scale-0"
            >
              <Dialog.Panel className="w-4/5 bg-white rounded-2xl p-6 flex flex-col items-center text-center">
                <Dialog.Title className="text-primary text-xs font-medium">
                  {modalState.title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-primary/70 text-xxs">
                  {modalState.desc}
                </Dialog.Description>
                <button
                  className="mt-4 px-4 py-2 rounded-full outline-none bg-gradient text-white text-xs font-medium"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </Transition.Child>
        </Dialog>
      </Transition>
    </section>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ScanResult;
