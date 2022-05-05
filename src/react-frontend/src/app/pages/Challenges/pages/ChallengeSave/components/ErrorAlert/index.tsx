import { Alert, Typography } from 'antd';
import { StubGeneratorError } from 'app/api/types/stubGenerator';
import React from 'react';

const { Text } = Typography;

interface ErrorAlertProps {
  error: StubGeneratorError;
}

export default function ErrorAlert(props: ErrorAlertProps) {
  const StubInputDetails = (): React.ReactNode => {
    switch (props.error.validationCode) {
      // statement
      case 'KeywordInvalid':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'is not a valid keyword.'}
          </>
        );
      case 'TextMissing':
        return (
          <>
            {'Missing text for'} <Text code>{props.error.culpritName}</Text>
            {'.'}
          </>
        );
      case 'VariablesMissing':
        return (
          <>
            {'Missing variables for'}{' '}
            <Text code>{props.error.culpritName}</Text>
            {'.'}
          </>
        );
      case 'LoopValueMissing':
        return (
          <>
            {'Missing loop condition value for'}{' '}
            <Text code>{props.error.culpritName}</Text>
            {'.'}
          </>
        );
      case 'LoopVariableNameInvalid':
        return (
          <>
            {'Invalid loop condition variable name for'}{' '}
            <Text code>{props.error.culpritName}</Text>
            {'.'}
          </>
        );
      case 'LoopVariablesMissing':
        return (
          <>
            {'Missing variables for'}{' '}
            <Text code>{props.error.culpritName}</Text>
            {'.'}
          </>
        );

      // variable
      case 'NameInvalid':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'is not validvariable name.'}
          </>
        );
      case 'TypeMissing':
        return (
          <>
            {'Missing type for'} <Text code>{props.error.culpritName}</Text>{' '}
            {'variable.'}
          </>
        );
      case 'TypeInvalid':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'is not a valid variable type.'}
          </>
        );
      case 'LengthMissing':
        return (
          <>
            {'Missing length for'} <Text code>{props.error.culpritName}</Text>{' '}
            {'variable.'}
          </>
        );
      case 'LengthInvalid':
        return (
          <>
            {'Invalid length for'} <Text code>{props.error.culpritName}</Text>{' '}
            {'variable.'}
          </>
        );
      case 'LengthOverflow':
        return (
          <>
            {'Length overflow for'} <Text code>{props.error.culpritName}</Text>{' '}
            {'variable.'}
          </>
        );
      case 'LengthNegativeOrZero':
        return (
          <>
            {'Length negative or zero for'}{' '}
            <Text code>{props.error.culpritName}</Text> {'variable.'}
          </>
        );
      case 'LengthNotNeeded':
        return (
          <>
            {'Length is not needed for'}{' '}
            <Text code>{props.error.culpritName}</Text> {'variable type.'}
          </>
        );

      // final
      case 'LoopVariableNotDeclared':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'was not declared in this scope.'}
          </>
        );
      case 'LoopVariableTypeNotIntOrFloat':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'should be a number type variable.'}
          </>
        );
      case 'StringVariableShouldBeSingle':
        return <>{'Cannot use string with multiple variables.'}</>;
      case 'VariableAlreadyDeclared':
        return (
          <>
            <Text code>{props.error.culpritName}</Text>{' '}
            {'was already declared in this scope.'}
          </>
        );

      default:
        return <>{'Unexcepted error!'}</>;
    }
  };

  return (
    <Alert
      type="error"
      showIcon
      message={
        <>
          <Text strong>Line {props.error.line}: </Text> {StubInputDetails()}
        </>
      }
    />
  );
}
