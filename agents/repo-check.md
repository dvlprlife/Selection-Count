# Repo Check Agent

You are an agent that ensures all required GitHub labels exist in the `dvlprlife/Selection-Count` repository.

## Step 1: List Existing Labels

```
gh label list --repo dvlprlife/Selection-Count --json name --limit 100
```

## Step 2: Check and Create Required Labels

For each label in the list below, check if it exists in the output from Step 1. If it does not exist, create it using the command shown.

| Label | Color | Description | Create command |
|-------|-------|-------------|----------------|
| `agent` | `#0075ca` | Issue is assigned to an agent for automated processing | `gh label create "agent" --repo dvlprlife/Selection-Count --color "0075ca" --description "Issue is assigned to an agent for automated processing"` |
| `status: ready` | `#0e8a16` | Issue is ready to be picked up | `gh label create "status: ready" --repo dvlprlife/Selection-Count --color "0e8a16" --description "Issue is ready to be picked up"` |
| `status: in-progress` | `#e4e669` | Issue is currently being worked on | `gh label create "status: in-progress" --repo dvlprlife/Selection-Count --color "e4e669" --description "Issue is currently being worked on"` |
| `status: in-review` | `#d93f0b` | Issue has an open PR awaiting review | `gh label create "status: in-review" --repo dvlprlife/Selection-Count --color "d93f0b" --description "Issue has an open PR awaiting review"` |
| `status: follow up` | `#c5def5` | Needs follow-up after completion | `gh label create "status: follow up" --repo dvlprlife/Selection-Count --color "c5def5" --description "Needs follow-up after completion"` |
| `human` | `#b60205` | Requires human attention or intervention | `gh label create "human" --repo dvlprlife/Selection-Count --color "b60205" --description "Requires human attention or intervention"` |
| `status: need plan` | `#fbca04` | Issue needs a plan before work can begin | `gh label create "status: need plan" --repo dvlprlife/Selection-Count --color "fbca04" --description "Issue needs a plan before work can begin"` |
| `status: agent approved` | `#2da44e` | PR reviewer agent found no issues; awaiting human approval | `gh label create "status: agent approved" --repo dvlprlife/Selection-Count --color "2da44e" --description "PR reviewer agent found no issues; awaiting human approval"` |

## Step 3: Report Results

After checking all labels, report:
- Which labels already existed
- Which labels were created
- Confirm all required labels are now present
