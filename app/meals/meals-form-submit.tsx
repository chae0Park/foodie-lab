'use client';

import { useFormState } from 'react-dom';

interface FormState {
    pending: boolean;
  }

export default function MealsFormSubmit(){
    const initialState: FormState = { pending: false };

    // NOTE: 실제 사용 시 formAction 함수도 있어야 정상 작동함
    const [state] = useFormState<FormState, FormData>(() => initialState, initialState);
  
    return (
      <button disabled={state.pending}>
        {state.pending ? 'Submitting...' : 'Share Meal'}
      </button>
    );
}