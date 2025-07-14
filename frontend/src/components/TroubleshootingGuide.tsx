import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, FormControlLabel, InputLabel, Select, MenuItem,
  Typography, List, ListItem, Paper, TextField, Button, Switch, Chip
} from '@mui/material';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5050';
axios.defaults.headers.post['Content-Type'] = 'application/json';

interface IssueOption { id: string; problem: string }
interface Entry {
  id: string;
  steps: string[];
  image?: string;
  source?: 'knowledge-base' | 'llm';
}

const TroubleshootingGuide: React.FC = () => {
  /* ─────────────────────────── state ─────────────────────────── */
  const [machine, setMachine]          = useState('');
  const [issues, setIssues]            = useState<IssueOption[]>([]);
  const [issueId, setIssueId]          = useState('');
  const [steps, setSteps]              = useState<string[]>([]);
  const [picture, setPicture]          = useState<string>('');
  const [fromKB, setFromKB]            = useState(false);

  const [useAI, setUseAI]              = useState(true);
  const [searchQuery, setSearchQuery]  = useState('');

  /* ────────────────────────── helpers ────────────────────────── */
  useEffect(() => {
    if (!machine) {
      setIssues([]); setIssueId(''); setSteps([]); setPicture(''); return;
    }
    axios.get<{ issues: IssueOption[] }>(`/api/search/issues/${machine}`)
      .then(r => setIssues(r.data.issues))
      .catch(() => setIssues([]));

    // reset display whenever machine changes
    setIssueId(''); setSteps([]); setPicture('');
  }, [machine]);

  const handlePreset = () => {
  if (!machine || !issueId) return;

  // find the text of the selected issue so we can send it as query
  const selectedIssue = issues.find(i => i.id === issueId);
  const issueText    = selectedIssue ? selectedIssue.problem : '';

  axios
    .post<{ results: Entry[] }>('/api/search/troubleshoot', {
      query: issueText,          // <-- non-empty query
      machineType: machine,
      noLLM: true                // force knowledge-base only
    })
    .then(res => {
      const entry = res.data.results.find(r => r.id === issueId);
      if (entry) {
        setSteps(entry.steps);
        setPicture(entry.image ?? '');
        setFromKB(true);
        setSearchQuery('');      // clear any free-text query
      } else {
        // fallback: tell user nothing found (edge-case)
        setSteps([]);
        setPicture('');
      }
    })
    .catch(() => {
      setSteps([]);
      setPicture('');
    });
};


  const handleSearch = async () => {
    if (!machine || !searchQuery.trim()) return;
    const body: Record<string, unknown> = { machineType: machine, query: searchQuery };
    if (!useAI) body.noLLM = true;                 // disable AI if switch OFF
    const { data } = await axios.post<{ results: Entry[] }>('/api/search/troubleshoot', body);

    const first = data.results[0];
    if (first) {
      setSteps(first.steps);
      setPicture(first.image ?? '');
      setFromKB(first.source === 'knowledge-base');
      setIssueId('');                               // clear dropdown so source is obvious
    }
  };

  /* ─────────────────────────── render ────────────────────────── */
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>Machine Troubleshooting Guide</Typography>

      <Paper sx={{ p:2, mb:3 }}>
        {/* machine selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Machine</InputLabel>
          <Select value={machine} onChange={e => setMachine(e.target.value)}>
            <MenuItem value="">Select Machine</MenuItem>
            <MenuItem value="cross-conveyor">Cross Conveyor</MenuItem>
            <MenuItem value="sandwiching">Sandwiching</MenuItem>
            <MenuItem value="auto-feeder">Auto Feeder</MenuItem>
            <MenuItem value="slug-loader">Slug Loader</MenuItem>
          </Select>
        </FormControl>

        {/* issue dropdown */}
        <FormControl fullWidth margin="normal" disabled={!machine}>
          <InputLabel>Issue</InputLabel>
          <Select value={issueId} onChange={e => setIssueId(e.target.value)}>
            <MenuItem value="">Select Issue</MenuItem>
            {issues.map(i => <MenuItem key={i.id} value={i.id}>{i.problem}</MenuItem>)}
          </Select>
        </FormControl>

        {/* AI toggle */}
        <FormControlLabel
          control={<Switch checked={useAI} onChange={() => setUseAI(p => !p)} color="primary" />}
          label="Allow AI fallback"
        />

        {/* action row */}
        <Box display="flex" gap={1} mt={1} mb={1} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={handlePreset}
            disabled={!machine || !issueId || !useAI && !!searchQuery.trim()}
          >
            Show Pre-set Steps
          </Button>

          <TextField
            fullWidth
            label="Or search for a specific problem"
            placeholder="e.g., unusual noise"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />

          <Button
            variant="outlined"
            onClick={handleSearch}
            disabled={!machine || !searchQuery.trim()}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {steps.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Step-by-Step Solution&nbsp;
            <Chip size="small" label={fromKB ? 'KB' : 'AI'} color={fromKB ? 'primary' : 'secondary'} />
          </Typography>

          {picture && (
            <Box component="img" src={picture} alt="illustration"
                 sx={{ width:'100%', mb:2, borderRadius:1 }} />
          )}

          <List>
            {steps.map((s, i) => <ListItem key={i}>{`${i+1}. ${s}`}</ListItem>)}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default TroubleshootingGuide;




