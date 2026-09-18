import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
export default function useApiResource(url) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!url) { setState({ data: null, loading: false, error: 'No order was selected.' }); return; }
    const controller = new AbortController();
    setState({ data: null, loading: true, error: '' });
    api.get(url, { signal: controller.signal }).then(res => {
      if (!controller.signal.aborted) setState({ data: res.data.data, loading: false, error: '' });
    }).catch(err => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: err.response?.data?.message || 'Could not load orders. Please try again.' });
    });
    return () => controller.abort();
  }, [url, revision]);
  useEffect(() => {
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [refresh]);
  return { ...state, refresh };
}
