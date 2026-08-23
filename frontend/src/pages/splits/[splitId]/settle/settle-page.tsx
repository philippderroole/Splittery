import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMembers } from "@/providers/member-provider";
import { useSplit } from "@/providers/split-provider";
import { useTags } from "@/providers/tag-provider";
import { createTransaction } from "@/service/transaction-service";
import { calculateSettlements, Settlement } from "@/utils/split";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { Member } from "@/utils/user";
import { useState } from "react";

export default function SettlePage() {
  const split = useSplit();
  const members = useMembers();
  const tags = useTags();
  const [recordingKey, setRecordingKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const settlements = calculateSettlements(
    members.map((member) => ({
      id: member.id,
      balance: member.amountBalance.getAmount(),
    })),
  );
  const membersById = new Map(members.map((member) => [member.id, member]));

  const recordSettlement = async (settlement: Settlement) => {
    const key = `${settlement.payerId}-${settlement.recipientId}`;
    const recipient = membersById.get(settlement.recipientId);
    const recipientTag = tags.find(
      (tag) =>
        tag.name === recipient?.name && recipient.tagIds.includes(tag.id),
    );

    if (!recipientTag) {
      setErrorKey(key);
      return;
    }

    setRecordingKey(key);
    setErrorKey(null);
    try {
      await createTransaction(split.id, {
        name: "Repayment",
        amount: settlement.amount,
        memberId: settlement.payerId,
        tagIds: [recipientTag.id],
      });
    } catch {
      setErrorKey(key);
    } finally {
      setRecordingKey(null);
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h5">Settle up</Typography>
        <Typography color="text.secondary">
          The fewest payments needed to clear everyone&apos;s balance.
        </Typography>
      </Box>
      {settlements.length === 0 ? (
        <Alert
          icon={<CheckCircleOutlineIcon />}
          severity="success"
          sx={{ mx: 2 }}
        >
          Everyone is settled up.
        </Alert>
      ) : (
        <List sx={{ p: 0 }}>
          {settlements.map((settlement) => (
            <SettlementItem
              key={`${settlement.payerId}-${settlement.recipientId}`}
              settlement={settlement}
              payer={membersById.get(settlement.payerId)}
              recipient={membersById.get(settlement.recipientId)}
              isRecording={
                recordingKey ===
                `${settlement.payerId}-${settlement.recipientId}`
              }
              hasError={
                errorKey === `${settlement.payerId}-${settlement.recipientId}`
              }
              onRecord={() => recordSettlement(settlement)}
            />
          ))}
        </List>
      )}
    </Box>
  );
}

function SettlementItem({
  settlement,
  payer,
  recipient,
  isRecording,
  hasError,
  onRecord,
}: {
  settlement: Settlement;
  payer?: Member;
  recipient?: Member;
  isRecording: boolean;
  hasError: boolean;
  onRecord: () => void;
}) {
  if (!payer || !recipient) {
    return null;
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={`/static/images/avatar/${payer.avatarUri}.jpg`}>
          {payer.name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${payer.name} pays ${recipient.name}`}
        secondary="to settle the balance"
      />
      <Typography variant="h6" sx={{ ml: 2, whiteSpace: "nowrap" }}>
        {new Money(settlement.amount, Currencies.EUR).toString()}
      </Typography>
      <Box sx={{ ml: 2, minWidth: 110, textAlign: "right" }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={
            isRecording ? <CircularProgress size={16} /> : <PaymentIcon />
          }
          disabled={isRecording}
          onClick={onRecord}
        >
          Record
        </Button>
        {hasError && (
          <Typography variant="caption" color="error" display="block">
            Failed
          </Typography>
        )}
      </Box>
    </ListItem>
  );
}
