/**
 * Copyright 2023 The Nephio Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TextField } from '@material-ui/core';
import React, { Fragment, useRef } from 'react';
import { KubernetesKeyValueObject } from '../../../../../../../types/KubernetesResource';
import { toLowerCase } from '../../../../../../../utils/string';
import { EditorAccordion } from '../../../Controls';
import { AccordionState } from '../../../Controls/EditorAccordion';

type OnUpdatedKeyValueObject = (
  keyValueObject: KubernetesKeyValueObject,
) => void;

type KeyValueObjectEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  keyValueObject: KubernetesKeyValueObject;
  onUpdatedKeyValueObject: OnUpdatedKeyValueObject;
};

type InternalKeyValue = {
  key: string;
  value: string;
};

export const ValueEditorAccordion = ({
  id,
  title,
  state,
  keyValueObject,
  onUpdatedKeyValueObject,
}: KeyValueObjectEditorProps) => {
  const createKeyValueArray = (): InternalKeyValue[] =>
    Object.entries(keyValueObject || {}).map(([key, value]) => ({
      key,
      value,
    }));

  const refViewModel = useRef<InternalKeyValue[]>(createKeyValueArray());

  const keyValueObjectUpdated = (): void => {
    const updatedObject = refViewModel.current
      .filter(keyValue => keyValue.key !== '')
      .reduce((prev: KubernetesKeyValueObject, keyValue: InternalKeyValue) => {
        prev[keyValue.key] = keyValue.value;
        return prev;
      }, {});

    onUpdatedKeyValueObject(updatedObject);
  };

  const description = `${refViewModel.current.length} ${toLowerCase(title)}`;

  return (
    <EditorAccordion
      id={id}
      state={state}
      title={title}
      description={description}
    >
      <Fragment>
        {refViewModel.current.map((keyValuePair, index) => (
          <TextField
            key={index}
            label={keyValuePair.key}
            variant="outlined"
            value={keyValuePair.value}
            onChange={e => {
              keyValuePair.value = e.target.value;
              keyValueObjectUpdated();
            }}
            fullWidth
          />
        ))}
      </Fragment>
    </EditorAccordion>
  );
};
