import { useCallback, useEffect, useState } from "react";
import ActionManager, { ActionHandler, ConfigManager } from "./managers";
import { Events } from "csgogsi";
import { GSI } from "../HUD";
import type { AllActions, GetInputsFromSection, Sections } from "./settings";

export const actions = new ActionManager();
export const configs = new ConfigManager();

type EmptyListener = () => void;

type BaseEvents = keyof Events;
type Callback<K> = K extends BaseEvents ? Events[K] | EmptyListener : EmptyListener;

export function useAction<T extends keyof AllActions>(action: T, callback: ActionHandler<T extends keyof AllActions ? AllActions[T] : never>, deps?: React.DependencyList) {
  useEffect(() => {

    actions.on(action, callback);
    return () => {
        actions.off(action, callback);
    };
  }, deps ? [action, ...deps] : [action, callback]);
  return null;
}
export function useOnConfigChange<K extends keyof Sections, T = any>(section: K, callback: ActionHandler<{ [L in keyof (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)]?: (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)[L] } | null>, deps?: React.DependencyList){

    useEffect(() => {
      const onDataChanged = (data: any) => {
        callback(data?.[section] || null);
      };

      configs.onChange(onDataChanged);
      onDataChanged(configs.data);

      return () => {
        configs.off(onDataChanged);
      }
    }, deps ? [section, ...deps] : [section, callback])

    return null;
}

export function onGSI<T extends BaseEvents>(event: T, callback: Callback<T>, deps?: React.DependencyList){
  useEffect(() => {
    GSI.on(event, callback);

    return () => {
      GSI.off(event, callback);
    }
  }, deps ? [event, ...deps] : [event, callback])
}

export function useConfig<K extends keyof Sections, T extends { [K: string]: any } = {}>(section: K){
  const [ data, setData ] = useState<{ [L in keyof (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)]?: (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)[L] } | null>(configs.data?.[section] || null);

  const onDataChanged = useCallback((sectionData: any) => {
    setData(sectionData || null);
  }, [section]);

  useOnConfigChange(section, onDataChanged);
  return data;
}
