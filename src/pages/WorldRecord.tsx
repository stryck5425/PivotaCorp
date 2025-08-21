import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UserRecord {
  uid: string;
  username: string;
  personalRecordTimeSpent: number;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .filter((v, i) => v !== '00' || i > 0 || h > 0)
    .join(':');
};

const WorldRecord: React.FC = () => {
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, username: currentUserUsername } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('personalRecordTimeSpent', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedRecords: UserRecord[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRecords.push({
            uid: doc.id,
            username: doc.data().username,
            personalRecordTimeSpent: doc.data().personalRecordTimeSpent,
          });
        });
        setRecords(fetchedRecords);
      } catch (error) {
        console.error("Error fetching world records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSurroundingRecords = (username: string, list: UserRecord[], range: number = 2) => {
    const lowerCaseUsername = username.toLowerCase();
    const userIndex = list.findIndex(r => r.username.toLowerCase() === lowerCaseUsername);

    if (userIndex === -1) {
      return filteredRecords; // If user not found, return all filtered records
    }

    const start = Math.max(0, userIndex - range);
    const end = Math.min(list.length, userIndex + range + 1);

    // If the user is found, show them and a few around them
    const surrounding = list.slice(start, end);

    // If the list is too short to fill the range, adjust
    if (surrounding.length < (2 * range + 1) && list.length > (2 * range + 1)) {
      if (start === 0) {
        return list.slice(0, 2 * range + 1);
      } else if (end === list.length) {
        return list.slice(list.length - (2 * range + 1), list.length);
      }
    }
    return surrounding;
  };

  const recordsToDisplay = searchTerm
    ? getSurroundingRecords(searchTerm, records)
    : records;

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-4 lg:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">World Records</CardTitle>
          <p className="text-muted-foreground">See who has endured the most terms and conditions!</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md mx-auto block"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-muted-foreground">No records found. Be the first to set one!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-right">Time Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordsToDisplay.map((record, index) => {
                    const originalIndex = records.findIndex(r => r.uid === record.uid);
                    const isCurrentUser = user && record.uid === user.uid;
                    return (
                      <TableRow key={record.uid} className={isCurrentUser ? 'bg-primary/10 font-semibold' : ''}>
                        <TableCell>{originalIndex + 1}</TableCell>
                        <TableCell>{record.username}</TableCell>
                        <TableCell className="text-right">{formatTime(record.personalRecordTimeSpent)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!user && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-2">Want to see your name on the leaderboard?</p>
              <Link to="/auth">
                <Button>Login / Sign Up</Button>
              </Link>
            </div>
          )}
          {user && !searchTerm && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Your current rank: {records.findIndex(r => r.uid === user.uid) + 1}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldRecord;